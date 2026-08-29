import { NextResponse } from 'next/server';
import { getOrdersByMobile } from '@/lib/db';

/**
 * GET /api/orders/customer?mobile=1234567890
 * Fetches all orders matching a specific customer mobile number.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get('mobile');

    if (!mobile) {
      return NextResponse.json(
        { error: 'Customer mobile number is required.' },
        { status: 400 }
      );
    }

    const orders = await getOrdersByMobile(mobile);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('API getOrdersByMobile error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders from database.' },
      { status: 500 }
    );
  }
}
