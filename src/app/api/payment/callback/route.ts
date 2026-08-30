import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/payment/callback
 * Server-to-Server (S2S) webhook endpoint for PhonePe transaction updates.
 * Verifies X-VERIFY checksum signature and updates DB order status.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const xVerifyHeader = req.headers.get('x-verify');

    const saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

    if (!rawBody?.response || !xVerifyHeader) {
      return NextResponse.json({ success: false, message: 'Invalid callback payload' }, { status: 400 });
    }

    // 1. Validate X-VERIFY Checksum: SHA256(rawBody.response + saltKey) + "###" + saltIndex
    const stringToHash = rawBody.response + saltKey;
    const computedHash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const expectedXVerify = `${computedHash}###${saltIndex}`;

    if (expectedXVerify !== xVerifyHeader) {
      console.error('PhonePe S2S X-VERIFY signature mismatch');
      return NextResponse.json({ success: false, message: 'Checksum verification failed' }, { status: 401 });
    }

    // 2. Base64 decode payload
    const decodedBuffer = Buffer.from(rawBody.response, 'base64');
    const decodedJson = JSON.parse(decodedBuffer.toString('utf-8'));

    console.log('PhonePe S2S Webhook Decoded Data:', decodedJson);

    // 3. Status processing
    const { code, data } = decodedJson;
    const transactionId = data?.merchantTransactionId;

    if (code === 'PAYMENT_SUCCESS') {
      console.log(`Payment SUCCESS for transaction: ${transactionId}`);
    } else {
      console.warn(`Payment failed or declined for transaction ${transactionId}: ${code}`);
    }

    return NextResponse.json({ success: true, message: 'Acknowledged' }, { status: 200 });
  } catch (error: any) {
    console.error('PhonePe callback error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
