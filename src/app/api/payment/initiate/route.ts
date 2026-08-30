import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

/**
 * POST /api/payment/initiate
 * Creates a Cashfree order and returns the payment_session_id for the frontend SDK.
 *
 * Env vars:
 *   CASHFREE_APP_ID     — Your Cashfree App ID
 *   CASHFREE_SECRET_KEY — Your Cashfree Secret Key
 *   CASHFREE_ENV        — "sandbox" | "production"
 *   NEXT_PUBLIC_APP_URL — Your public app base URL
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { customerName, customerMobile, totalAmount, items } = body;

    if (!customerName || !customerMobile || typeof totalAmount !== 'number' || !items?.length) {
      return NextResponse.json({ error: 'Missing required order fields.' }, { status: 400 });
    }

    const appId     = process.env.CASHFREE_APP_ID     || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    const env       = process.env.CASHFREE_ENV        || 'sandbox';
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const baseUrl = env === 'production'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    // Unique order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const returnUrl = `${appUrl}/api/payment/verify?order_id={order_id}&cf_order_id={order_id}`;

    // Create order on Cashfree
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
          customer_phone: customerMobile.replace(/\D/g, ''),
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
        { error: cfData?.message || 'Failed to create Cashfree order.' },
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
    return NextResponse.json({ error: 'Failed to initiate payment.' }, { status: 500 });
  }
}
