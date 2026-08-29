import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const isExternal = connectionString?.includes('supabase') || connectionString?.includes('pooler') || connectionString?.includes('render');

const pool = new Pool({
  connectionString,
  ssl: isExternal ? { rejectUnauthorized: false } : undefined,
});

let dbInitialized = false;

/**
 * Automatically checks and initializes required database tables and default admin seeding.
 * Runs on demand before executing any queries to handle fresh database setups.
 */
export async function initDb() {
  if (dbInitialized) return;

  try {
    // Check if the 'orders' table already exists
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
      );
    `);
    
    const tablesExist = tableCheckResult.rows[0]?.exists;

    if (!tablesExist) {
      console.log('--- 30° Turn Cafe DB: Initializing fresh tables ---');

      // 1. Create users table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Create orders table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          customer_name VARCHAR(255) NOT NULL,
          customer_mobile VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Create order_items table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          item_name VARCHAR(255) NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          price NUMERIC(10, 2) NOT NULL
        );
      `);

      // 4. Seed default admin account
      // email: admin@30degreecafe.com
      // password: admin123
      const defaultAdminHash = '$2b$10$YojHF1gmZMrA8fdWmO.SSuTm16uwbJuUi16Lu09djktorLd6wuCFq';
      await pool.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Cafe Admin', 'admin@30degreecafe.com', $1, 'admin')
        ON CONFLICT (email) DO NOTHING;
      `, [defaultAdminHash]);

      console.log('--- 30° Turn Cafe DB: Table initialization complete ---');
    }

    dbInitialized = true;
  } catch (error) {
    console.error('--- 30° Turn Cafe DB: Error initializing tables ---', error);
  }
}

export async function query(text: string, params?: any[]) {
  await initDb();
  return pool.query(text, params);
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

/**
 * Creates a cafe order and all its associated items inside a single SQL transaction.
 */
export async function createOrder(
  customerName: string,
  customerMobile: string,
  totalAmount: number,
  items: OrderItem[]
) {
  await initDb();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into orders table
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_mobile, total_amount, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, customer_name, customer_mobile, status, total_amount, created_at`,
      [customerName, customerMobile, totalAmount]
    );
    const order = orderResult.rows[0];

    // 2. Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_name, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.name, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    return {
      id: order.id,
      customerName: order.customer_name,
      customerMobile: order.customer_mobile,
      status: order.status,
      totalAmount: parseFloat(order.total_amount),
      createdAt: order.created_at,
      items
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Retrieves all orders with their respective items, ordered by creation date descending.
 */
export async function getAllOrders() {
  await initDb();
  
  // Query to fetch orders
  const ordersResult = await pool.query(
    `SELECT id, customer_name, customer_mobile, status, total_amount, created_at
     FROM orders
     ORDER BY created_at DESC`
  );

  if (ordersResult.rows.length === 0) {
    return [];
  }

  // Fetch all order items and map them
  const itemsResult = await pool.query(
    `SELECT order_id, item_name, quantity, price
     FROM order_items`
  );

  const itemsMap: Record<string, Array<{ name: string; quantity: number; price: number }>> = {};
  for (const row of itemsResult.rows) {
    if (!itemsMap[row.order_id]) {
      itemsMap[row.order_id] = [];
    }
    itemsMap[row.order_id].push({
      name: row.item_name,
      quantity: row.quantity,
      price: parseFloat(row.price)
    });
  }

  return ordersResult.rows.map(order => ({
    id: order.id,
    customerName: order.customer_name,
    customerMobile: order.customer_mobile,
    status: order.status,
    totalAmount: parseFloat(order.total_amount),
    createdAt: order.created_at,
    items: itemsMap[order.id] || []
  }));
}

/**
 * Updates the status of an existing order.
 */
export async function updateOrderStatus(orderId: string, status: string) {
  await initDb();
  
  const result = await pool.query(
    `UPDATE orders
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, customer_name, customer_mobile, status, total_amount, created_at`,
    [status, orderId]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Order not found');
  }
  
  const order = result.rows[0];
  return {
    id: order.id,
    customerName: order.customer_name,
    customerMobile: order.customer_mobile,
    status: order.status,
    totalAmount: parseFloat(order.total_amount),
    createdAt: order.created_at
  };
}

/**
 * Retrieves user details by email (for authentication).
 */
export async function getUserByEmail(email: string) {
  await initDb();
  
  const result = await pool.query(
    `SELECT id, name, email, password_hash, role, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  
  return result.rows[0] || null;
}

/**
 * Retrieves all orders and their items matching a specific customer mobile number.
 */
export async function getOrdersByMobile(mobile: string) {
  await initDb();
  
  const ordersResult = await pool.query(
    `SELECT id, customer_name, customer_mobile, status, total_amount, created_at
     FROM orders
     WHERE customer_mobile = $1
     ORDER BY created_at DESC`,
    [mobile]
  );

  if (ordersResult.rows.length === 0) {
    return [];
  }

  // Fetch all order items and map them
  const itemsResult = await pool.query(
    `SELECT order_id, item_name, quantity, price
     FROM order_items`
  );

  const itemsMap: Record<string, Array<{ name: string; quantity: number; price: number }>> = {};
  for (const row of itemsResult.rows) {
    if (!itemsMap[row.order_id]) {
      itemsMap[row.order_id] = [];
    }
    itemsMap[row.order_id].push({
      name: row.item_name,
      quantity: row.quantity,
      price: parseFloat(row.price)
    });
  }

  return ordersResult.rows.map(order => ({
    id: order.id,
    customerName: order.customer_name,
    customerMobile: order.customer_mobile,
    status: order.status,
    totalAmount: parseFloat(order.total_amount),
    createdAt: order.created_at,
    items: itemsMap[order.id] || []
  }));
}

/**
 * Appends items to an existing pending/preparing order in a transaction and updates the total amount.
 */
export async function appendItemsToOrder(orderId: string, items: OrderItem[], additionalAmount: number) {
  await initDb();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify order exists and is not completed or cancelled
    const orderCheck = await client.query(
      `SELECT status, customer_name, customer_mobile, total_amount, created_at FROM orders WHERE id = $1`,
      [orderId]
    );
    if (orderCheck.rows.length === 0) {
      throw new Error('Order not found');
    }
    const order = orderCheck.rows[0];
    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new Error(`Cannot add items to a ${order.status} order.`);
    }

    // 2. Update order total amount in SQL
    const updatedAmount = parseFloat(order.total_amount) + additionalAmount;
    await client.query(
      `UPDATE orders
       SET total_amount = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [updatedAmount, orderId]
    );

    // 3. Insert items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_name, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.name, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    
    return {
      id: orderId,
      customerName: order.customer_name,
      customerMobile: order.customer_mobile,
      status: order.status,
      totalAmount: updatedAmount,
      createdAt: order.created_at
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
