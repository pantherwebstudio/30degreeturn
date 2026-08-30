import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrder } from '@/lib/db';

/**
 * GET /api/payment/verify?txnId=xxx
 * User redirect landing endpoint after completing payment on PhonePe Payment Page.
 * Performs Server-Side Status Check against PhonePe `/pg/v1/status` API, creates DB order, and redirects user.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('txnId') || searchParams.get('merchantTransactionId');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!transactionId) {
    return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
  }

  try {
    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
    const saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    // 1. Compute X-VERIFY for Status API: SHA256("/pg/v1/status/{merchantId}/{txnId}" + saltKey) + "###" + saltIndex
    const endpoint = `/pg/v1/status/${merchantId}/${transactionId}`;
    const stringToHash = endpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${sha256}###${saltIndex}`;

    // 2. Send GET request to PhonePe Status API
    const response = await fetch(`${hostUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': merchantId,
      },
      cache: 'no-store',
    });

    const responseData = await response.json();
    console.log('PhonePe Status Verification Response:', responseData);

    const isSuccess = responseData.success && (responseData.code === 'PAYMENT_SUCCESS' || responseData.data?.state === 'COMPLETED');

    if (!isSuccess) {
      console.warn('PhonePe status check failed or non-success code:', responseData);
      return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
    }

    // Payment Verified! Retrieve pending order metadata from request/cookie/DB or create order
    const totalAmount = responseData.data?.amount ? responseData.data.amount / 100 : 0;
    const customerMobile = responseData.data?.paymentInstrument?.accountNo || responseData.data?.mobileNumber || '9999999999';

    // Create DB Order
    const order = await createOrder(
      'Valued Customer',
      customerMobile,
      totalAmount,
      [{ name: 'PhonePe Cafe Order', quantity: 1, price: totalAmount }],
      'dine-in'
    );

    return NextResponse.redirect(`${appUrl}/menu?payment=success&orderId=${order.id}`);
  } catch (error: any) {
    console.error('PhonePe verification error:', error);
    return NextResponse.redirect(`${appUrl}/menu?payment=error`);
  }
}
