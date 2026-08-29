import { NextResponse } from 'next/server';
import { appendItemsToOrder } from '@/lib/db';

/**
 * POST /api/orders/[id]/append
 * Public endpoint to append items to an active order.
 * Inputs: items: Array<{ name, quantity, price }>, additionalAmount: number
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID parameter is required.' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { items, additionalAmount } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array cannot be empty.' },
        { status: 400 }
      );
    }

    if (typeof additionalAmount !== 'number') {
      return NextResponse.json(
        { error: 'Valid additionalAmount total is required.' },
        { status: 400 }
      );
    }

    const result = await appendItemsToOrder(id, items, additionalAmount);

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    console.error('API appendItemsToOrder error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to append items to the order.' },
      { status: 500 }
    );
  }
}
