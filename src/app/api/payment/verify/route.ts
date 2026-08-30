import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

/**
 * GET /api/payment/verify?order_id=xxx
 * User return URL landing endpoint after completing Cashfree payment checkout.
 * Verifies order status with Cashfree PG API, creates DB order, and redirects user.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id') || searchParams.get('cf_order_id');
  const host    = request.headers.get('host') || 'localhost:3000';
  const proto   = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

  if (!orderId) {
    return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
  }

  try {
    const appId     = process.env.CASHFREE_APP_ID     || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    const env       = process.env.CASHFREE_ENV        || 'sandbox';

    const baseUrl = env === 'production'
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cfRes = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      cache: 'no-store',
    });

    const cfData = await cfRes.json();
    console.log('Cashfree Order Verification Response:', cfData);

    const isPaid = cfRes.ok && cfData.order_status === 'PAID';

    if (!isPaid) {
      console.warn('Cashfree payment verification status is not PAID:', cfData);
      return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
    }

    const customerName = cfData.customer_details?.customer_name || 'Valued Customer';
    const customerMobile = cfData.customer_details?.customer_phone || '9999999999';
    const totalAmount = cfData.order_amount || 0;

    // Create DB Order on payment success
    const dbOrder = await createOrder(
      customerName,
      customerMobile,
      totalAmount,
      [{ name: cfData.order_note || 'Cafe Order', quantity: 1, price: totalAmount }],
      'dine-in'
    );

    return NextResponse.redirect(`${appUrl}/menu?payment=success&orderId=${dbOrder.id}`);
  } catch (error: any) {
    console.error('Cashfree verification error:', error);
    return NextResponse.redirect(`${appUrl}/menu?payment=error`);
  }
}
