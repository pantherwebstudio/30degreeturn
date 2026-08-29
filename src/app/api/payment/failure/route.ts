import { NextResponse } from 'next/server';

/**
 * POST /api/payment/failure
 * PayU calls this when payment fails or is cancelled.
 */
export async function POST(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
}

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${appUrl}/menu?payment=failed`);
}
