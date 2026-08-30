import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/payment/initiate
 * Initiates a PhonePe Payment Gateway checkout transaction using standard V1 Pay Page API.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { customerName, customerMobile, totalAmount, items, orderType } = body;

    if (!customerName || !customerMobile || typeof totalAmount !== 'number' || !items?.length) {
      return NextResponse.json({ error: 'Missing required order fields.' }, { status: 400 });
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
    const saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Unique transaction ID (max 38 chars, alphanumeric)
    const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Store order payload in memory / session storage / pending order metadata
    const returnUrl = `${appUrl}/api/payment/verify?txnId=${merchantTransactionId}`;
    const callbackUrl = `${appUrl}/api/payment/callback`;

    // Amount must be in Paise (e.g. ₹100 = 10000 paise)
    const amountInPaise = Math.round(totalAmount * 100);

    const payload = {
      merchantId,
      merchantTransactionId,
      merchantUserId: `CUST_${customerMobile.replace(/\D/g, '')}`,
      amount: amountInPaise,
      redirectUrl: returnUrl,
      redirectMode: 'REDIRECT',
      callbackUrl,
      mobileNumber: customerMobile.replace(/\D/g, '').slice(-10),
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    // 1. Base64 encode payload
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // 2. Compute X-VERIFY checksum: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
    const endpoint = '/pg/v1/pay';
    const stringToHash = base64Payload + endpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = `${sha256}###${saltIndex}`;

    // 3. Send POST request to PhonePe API
    const response = await fetch(`${hostUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const responseData = await response.json();

    if (responseData.success && responseData.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId,
      });
    } else {
      console.error('PhonePe Pay API Error:', responseData);
      return NextResponse.json(
        { error: responseData.message || 'PhonePe payment initiation failed.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('PhonePe initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate PhonePe payment.' }, { status: 500 });
  }
}
