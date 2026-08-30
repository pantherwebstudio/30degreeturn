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
        order_type VARCHAR(50) NOT NULL DEFAULT 'dine-in',
        total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Ensure order_type column exists on orders table
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type VARCHAR(50) DEFAULT 'dine-in';
    `);

    // 4. Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price NUMERIC(10, 2) NOT NULL
      );
    `);

    // 5. Create menu_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(255) NOT NULL,
        sub_category VARCHAR(255),
        is_veg BOOLEAN DEFAULT true,
        image TEXT,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Seed default admin account if missing
    const defaultAdminHash = '$2b$10$YojHF1gmZMrA8fdWmO.SSuTm16uwbJuUi16Lu09djktorLd6wuCFq';
    await pool.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Cafe Admin', 'admin@30degreecafe.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [defaultAdminHash]);

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
  items: OrderItem[],
  orderType: string = 'dine-in'
) {
  await initDb();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into orders table
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_mobile, total_amount, status, order_type)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id, customer_name, customer_mobile, status, order_type, total_amount, created_at`,
      [customerName, customerMobile, totalAmount, orderType || 'dine-in']
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
      orderType: order.order_type || 'dine-in',
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
    `SELECT id, customer_name, customer_mobile, status, order_type, total_amount, created_at
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
    orderType: order.order_type || 'dine-in',
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

export interface DbMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subCategory?: string;
  isVeg: boolean;
  image: string;
  available?: boolean;
}

const DEFAULT_MENU_ITEMS_SEED: DbMenuItem[] = [
  { id: 'test1', name: '🧪 PhonePe Test Brew', price: 1.00, description: '₹1 Test item for live & sandbox PhonePe payment verification', category: 'hot-classics', subCategory: 'Test Item', isVeg: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hc1', name: 'Espresso (Single)', price: 39, description: 'Freshly brewed single shot of espresso', category: 'hot-classics', subCategory: 'Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hc2', name: 'Espresso (Double)', price: 49, description: 'Freshly brewed double shot of espresso', category: 'hot-classics', subCategory: 'Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hc3', name: 'Americano', price: 49, description: 'Freshly brewed double shot of espresso stretched with hot water', category: 'hot-classics', subCategory: 'Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hc4', name: 'Cappuccino', price: 90, description: 'Freshly brewed espresso with milk froth & steamed milk', category: 'hot-classics', subCategory: 'Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hc5', name: 'Caffe Latte', price: 99, description: 'Freshly brewed espresso & steamed milk', category: 'hot-classics', subCategory: 'Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hc6', name: 'Cafe Mocha', price: 119, description: 'Single shot espresso with milk froth and chocolate truffle', category: 'hot-classics', subCategory: 'Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'fhc1', name: 'Filter Coffee', price: 40, description: 'Traditional espresso & steamed milk blend', category: 'flavoured-signature-latte', subCategory: 'Flavour Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'fhc2', name: 'Biscoff Latte', price: 119, description: 'Biscoff paste with single shot espresso and milk', category: 'flavoured-signature-latte', subCategory: 'Flavour Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'fhc3', name: 'White Mocha', price: 119, description: 'Milk chocolate truffle, steamed milk & single shot espresso', category: 'flavoured-signature-latte', subCategory: 'Flavour Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'fhc4', name: 'Spanish Cappuccino', price: 119, description: 'Milkmaid, single shot espresso, milk froth', category: 'flavoured-signature-latte', subCategory: 'Flavour Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'fhc5', name: 'Nutella Latte', price: 119, description: 'Nutella spread, single shot espresso, steamed milk', category: 'flavoured-signature-latte', subCategory: 'Flavour Hot Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'lt1', name: 'Dum Tea', price: 20, description: 'Classic aromatic spiced dum tea', category: 'tea-latte-matcha', subCategory: 'Leaf Tea', isVeg: true, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'lt2', name: 'Masala Tea', price: 30, description: 'Indian masala spiced brewed tea', category: 'tea-latte-matcha', subCategory: 'Leaf Tea', isVeg: true, image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'ic1', name: 'Iced Americano', price: 79, description: 'Double shot espresso, water, ice', category: 'espresso-on-ice', subCategory: 'Iced Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'bc1', name: 'Cafe Frappe', price: 139, description: 'Vanilla ice cream, milk, filter deduction', category: 'signature-frappe', subCategory: 'Blended Cold Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'bt1', name: 'Mango Bubble Tea', price: 99, description: 'Mango crush, black tea base, sugar syrup, boba, ice', category: 'boba-bubble-tea', subCategory: 'Bubble Tea', isVeg: true, image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'hch1', name: 'Classic Hot Chocolate', price: 79, description: 'Dark chocolate 70% combined with milk froth', category: 'artisan-hot-chocolate', subCategory: 'Hot Chocolate', isVeg: true, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'ms1', name: 'Vanilla Milkshake', price: 109, description: 'Vanilla ice cream, fresh cream, milk', category: 'gourmet-shakes', subCategory: 'Milkshake', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'm1', name: 'Virgin Mojito', price: 89, description: 'Mint leaves, mojito mint, ice, soda', category: 'refreshing-mocktails-cocktails', subCategory: 'Mocktails', isVeg: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'fj1', name: 'Watermelon Juice', price: 50, description: 'Freshly pressed organic watermelon juice', category: 'fresh-cold-pressed-juices', subCategory: 'Fresh Juices', isVeg: true, image: 'https://images.unsplash.com/photo-1589733955941-5eeaf75449d1?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'om1', name: 'Masala Omelette', price: 40, description: 'Spiced Indian masala double egg omelette', category: 'gourmet-omelettes', subCategory: 'Omelette', isVeg: false, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'sl1', name: 'Classic Fries', price: 70, description: 'Crispy golden salted potato fries', category: 'all-day-starters', subCategory: 'Sliders & Fries', isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'sw1', name: 'Grill Cheese Sandwich', price: 100, description: 'Golden toasted sandwich with melted cheese blend', category: 'signature-pizza-sandwiches', subCategory: 'Sandwich', isVeg: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'qd1', name: 'Veg Mexican Quesadilla', price: 100, description: 'Authentic grilled tortilla stuffed with Mexican spiced veggies & cheese', category: 'quesadilla', subCategory: 'Quesadilla', isVeg: true, image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'ps1', name: 'Alfredo Penne Pasta Veg', price: 100, description: 'Penne pasta in rich creamy parmesan alfredo sauce with veggies', category: 'pasta-pancakes-waffles', subCategory: 'Pasta', isVeg: true, image: 'https://images.unsplash.com/photo-1621996346565-e3def6166763?auto=format&fit=crop&q=80&w=400&h=400' },
  { id: 'wf1', name: 'Nutella Waffles', price: 120, description: 'Crispy Belgian waffle loaded with Nutella spread', category: 'pasta-pancakes-waffles', subCategory: 'Waffles', isVeg: true, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&q=80&w=400&h=400' }
];

export async function getAllMenuItems(): Promise<DbMenuItem[]> {
  await initDb();
  let res = await pool.query(
    `SELECT id, name, price, description, category, sub_category as "subCategory", is_veg as "isVeg", image, available
     FROM menu_items
     ORDER BY category ASC, name ASC`
  );

  if (res.rows.length === 0) {
    for (const item of DEFAULT_MENU_ITEMS_SEED) {
      await saveMenuItem(item);
    }
    res = await pool.query(
      `SELECT id, name, price, description, category, sub_category as "subCategory", is_veg as "isVeg", image, available
       FROM menu_items
       ORDER BY category ASC, name ASC`
    );
  }

  return res.rows.map(row => ({
    ...row,
    price: parseFloat(row.price),
    available: row.available ?? true
  }));
}

export async function saveMenuItem(item: DbMenuItem): Promise<DbMenuItem> {
  await initDb();
  const res = await pool.query(
    `INSERT INTO menu_items (id, name, price, description, category, sub_category, is_veg, image, available)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       price = EXCLUDED.price,
       description = EXCLUDED.description,
       category = EXCLUDED.category,
       sub_category = EXCLUDED.sub_category,
       is_veg = EXCLUDED.is_veg,
       image = EXCLUDED.image,
       available = EXCLUDED.available
     RETURNING id, name, price, description, category, sub_category as "subCategory", is_veg as "isVeg", image, available`,
    [
      item.id,
      item.name,
      item.price,
      item.description || '',
      item.category,
      item.subCategory || '',
      item.isVeg ?? true,
      item.image || '',
      item.available ?? true
    ]
  );
  const row = res.rows[0];
  return {
    ...row,
    price: parseFloat(row.price)
  };
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await initDb();
  const res = await pool.query(`DELETE FROM menu_items WHERE id = $1`, [id]);
  return (res.rowCount ?? 0) > 0;
}
