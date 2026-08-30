import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

/**
 * GET /api/payment/verify?order_id=xxx
 * Cashfree redirects the customer here after payment completion/failure.
 * Verifies status with Cashfree API and creates the DB order on success.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id') || searchParams.get('cf_order_id');
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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

    // Verify order status with Cashfree
    const cfRes = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error('Cashfree verify error:', cfData);
      return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
    }

    const status = cfData.order_status;

    if (status !== 'PAID') {
      return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
    }

    // Payment confirmed — create order in DB
    const customerName   = cfData.customer_details?.customer_name   || 'Customer';
    const customerMobile = cfData.customer_details?.customer_phone  || '0000000000';
    const totalAmount    = parseFloat(cfData.order_amount)           || 0;
    const orderNote      = cfData.order_note                        || 'Cafe Order';

    const order = await createOrder(
      customerName,
      customerMobile,
      totalAmount,
      [{ name: orderNote, quantity: 1, price: totalAmount }]
    );

    return NextResponse.redirect(
      `${appUrl}/menu?payment=success&orderId=${order.id}`
    );
  } catch (error: any) {
    console.error('Payment verify error:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/menu?payment=error`);
  }
}
