import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrder } from '@/lib/db';

/**
 * POST /api/payment/success
 * PayU calls this after a successful payment.
 * Verifies the response hash, creates the order in the DB, then redirects.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const {
      status,
      hash: payuHash,
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '',
      additionalCharges = '',
    } = params;

    const merchantSalt = process.env.PAYU_MERCHANT_SALT || 'YOUR_MERCHANT_SALT';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // PayU reverse hash: sha512(salt|status|||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    let reverseHashString: string;
    if (additionalCharges) {
      reverseHashString = [
        merchantSalt,
        status,
        additionalCharges,
        udf5, udf4, udf3, udf2, udf1,
        email, firstname, productinfo, amount, txnid, key
      ].join('|');
    } else {
      reverseHashString = [
        merchantSalt,
        status,
        '', '', '', '', '',
        udf5, udf4, udf3, udf2, udf1,
        email, firstname, productinfo, amount, txnid, key
      ].join('|');
    }

    const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

    if (calculatedHash !== payuHash) {
      console.error('PayU hash mismatch! Possible tampered response.');
      return NextResponse.redirect(`${appUrl}/menu?payment=tampered`);
    }

    if (status !== 'success') {
      return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
    }

    // Hash verified — extract order details from udf fields or productinfo
    // The pending order data is stored client-side; we re-create the order from PayU params.
    // Since PayU doesn't relay custom JSON, we use txnid as reference and expect
    // the client to have stored the order data in localStorage (30_turn_pending_order).
    // For server-side reliability, we store minimal info available from PayU response.
    const mobile = params.phone || '0000000000';
    const customerName = firstname || 'Customer';
    const totalAmt = parseFloat(amount) || 0;

    // Create order with available data (items will be fetched from pending order on client)
    const order = await createOrder(customerName, mobile, totalAmt, [
      { name: productinfo, quantity: 1, price: totalAmt }
    ]);

    return NextResponse.redirect(`${appUrl}/menu?payment=success&orderId=${order.id}`);
  } catch (error: any) {
    console.error('PayU success callback error:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/menu?payment=error`);
  }
}

// PayU can also send GET in some configurations
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
}
