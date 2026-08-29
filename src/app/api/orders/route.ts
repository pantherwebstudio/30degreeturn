import { NextResponse } from 'next/server';
import { createOrder, getAllOrders } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

/**
 * POST /api/orders
 * Public endpoint to place a new cafe order.
 * Inputs: customerName, customerMobile, totalAmount, items: Array<{ name, quantity, price }>
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { customerName, customerMobile, totalAmount, items } = body;

    // Validate inputs
    if (!customerName || !customerMobile) {
      return NextResponse.json(
        { error: 'Customer name and mobile number are required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    // Verify item formats
    for (const item of items) {
      if (!item.name || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        return NextResponse.json(
          { error: 'Invalid item format. Each item must have a name, quantity, and price.' },
          { status: 400 }
        );
      }
    }

    // Calculate/verify total sum
    const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = typeof totalAmount === 'number' ? totalAmount : calculatedTotal;

    // Save to Postgres
    const order = await createOrder(customerName, customerMobile, finalTotal, items);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('API createOrder error:', error);
    return NextResponse.json(
      { error: 'Failed to create order due to database or transaction error.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Secured endpoint to get all orders (Admin only).
 */
export async function GET() {
  try {
    // 1. Authenticate & Authorize User
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view orders.' },
        { status: 403 }
      );
    }

    // 2. Fetch orders from Postgres database
    const orders = await getAllOrders();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('API getAllOrders error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders from database.' },
      { status: 500 }
    );
  }
}
