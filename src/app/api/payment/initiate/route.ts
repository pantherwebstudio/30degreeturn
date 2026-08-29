import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/payment/initiate
 * Generates a PayU payment hash and returns all required form params.
 *
 * Required env vars:
 *   PAYU_MERCHANT_KEY   — Your PayU merchant key
 *   PAYU_MERCHANT_SALT  — Your PayU salt (v2)
 *   PAYU_BASE_URL       — https://secure.payu.in/_payment (prod) or https://test.payu.in/_payment (test)
 *   NEXT_PUBLIC_APP_URL — Your app's public base URL e.g. https://yourdomain.com
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { customerName, customerMobile, totalAmount, items } = body;

    if (!customerName || !customerMobile || typeof totalAmount !== 'number' || !items?.length) {
      return NextResponse.json({ error: 'Missing required order fields.' }, { status: 400 });
    }

    const merchantKey  = process.env.PAYU_MERCHANT_KEY  || 'YOUR_MERCHANT_KEY';
    const merchantSalt = process.env.PAYU_MERCHANT_SALT || 'YOUR_MERCHANT_SALT';
    const payuBaseUrl  = process.env.PAYU_BASE_URL       || 'https://test.payu.in/_payment';
    const appUrl       = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Unique transaction ID
    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const amount      = totalAmount.toFixed(2);
    const productInfo = items.map((i: any) => i.name).join(', ').slice(0, 100);
    const firstname   = customerName.trim().split(' ')[0];
    const email       = `${customerMobile}@30degreeturn.in`;
    const phone       = customerMobile.replace(/\D/g, '');

    const successUrl = `${appUrl}/api/payment/success`;
    const failureUrl = `${appUrl}/api/payment/failure`;

    // PayU Hash: sha512(key|txnid|amount|productinfo|firstname|email|udf1...|||||salt)
    const hashString = [
      merchantKey,
      txnId,
      amount,
      productInfo,
      firstname,
      email,
      '', '', '', '', '', '', '', '', '',
      merchantSalt
    ].join('|');

    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const params: Record<string, string> = {
      key:         merchantKey,
      txnid:       txnId,
      amount:      amount,
      productinfo: productInfo,
      firstname:   firstname,
      email:       email,
      phone:       phone,
      surl:        successUrl,
      furl:        failureUrl,
      hash:        hash,
      service_provider: 'payu_paisa',
    };

    return NextResponse.json({ success: true, payuBaseUrl, params, txnId });
  } catch (error: any) {
    console.error('PayU initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate payment.' }, { status: 500 });
  }
}
