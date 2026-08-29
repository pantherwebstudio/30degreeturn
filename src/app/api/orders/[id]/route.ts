import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

const VALID_STATUSES = ['pending', 'preparing', 'completed', 'cancelled'];

/**
 * PATCH /api/orders/[id]
 * Secured endpoint to update the status of an order (Admin/Staff only).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate user and verify role
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to modify orders.' },
        { status: 403 }
      );
    }

    // Resolve the route parameters (params is a Promise in Next.js 15/16)
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required.' },
        { status: 400 }
      );
    }

    // 2. Parse and validate body status
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Update order in the database
    const updatedOrder = await updateOrderStatus(id, status);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('API updateOrderStatus error:', error);
    if (error.message === 'Order not found') {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update order in database.' },
      { status: 500 }
    );
  }
}
