import { NextResponse } from 'next/server';

/**
 * POST /api/payment/initiate
 * Creates a Cashfree test order and returns the payment_session_id for Cashfree Web SDK.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { customerName, customerMobile, totalAmount, items, orderType } = body;

    if (!customerName || !customerMobile || typeof totalAmount !== 'number' || !items?.length) {
      return NextResponse.json({ error: 'Missing required order fields.' }, { status: 400 });
    }

    const appId     = process.env.CASHFREE_APP_ID     || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    const env       = process.env.CASHFREE_ENV        || 'sandbox';
    const host      = request.headers.get('host') || 'localhost:3000';
    const proto     = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

    const baseUrl = env === 'production'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    // Unique order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const returnUrl = `${appUrl}/api/payment/verify?order_id={order_id}`;

    // Create order on Cashfree PG
    const cfRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: parseFloat(totalAmount.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
          customer_id: customerMobile.replace(/\D/g, ''),
          customer_name: customerName,
          customer_phone: customerMobile.replace(/\D/g, '').slice(-10),
          customer_email: `${customerMobile.replace(/\D/g, '')}@30degreeturn.in`,
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: `${appUrl}/api/payment/webhook`,
        },
        order_note: items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ').slice(0, 200),
      }),
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error('Cashfree create order error:', cfData);
      return NextResponse.json(
        { error: cfData?.message || 'Failed to create Cashfree test order.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentSessionId: cfData.payment_session_id,
      orderId: cfData.order_id,
      cfEnv: env,
    });
  } catch (error: any) {
    console.error('Cashfree initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate Cashfree payment.' }, { status: 500 });
  }
}
