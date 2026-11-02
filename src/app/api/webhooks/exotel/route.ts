import { NextRequest, NextResponse } from 'next/server';
import { telephony } from '@/lib/telephony';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = (formData.get('CallSid') as string) || (formData.get('CallDate') as string) || `exo-${Date.now()}`;
    const from = (formData.get('From') as string) || (formData.get('Caller') as string) || '+919876543210';

    const res = telephony.generateExotelPassthru(callSid, from);
    return NextResponse.json(res);
  } catch (err: any) {
    console.error('[ExotelWebhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Exotel verification ping
  return NextResponse.json({ status: 'active', provider: 'exotel' });
}
