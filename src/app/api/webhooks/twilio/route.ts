import { NextRequest, NextResponse } from 'next/server';
import { telephony } from '@/lib/telephony';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    const formData = await req.formData();
    const callSid = (formData.get('CallSid') as string) || `twilio-${Date.now()}`;
    const from = (formData.get('From') as string) || '+919876543210';
    const recordingUrl = formData.get('RecordingUrl') as string;

    if (action === 'recorded' && recordingUrl) {
      await telephony.handleTwilioRecording(callSid, recordingUrl);
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="en-IN">Thank you! Your requirements have been captured. VoxBuild AI is now building and deploying your website.</Say>
  <Hangup />
</Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // Default incoming call: return TwiML
    const twiml = telephony.generateTwilioTwiML(callSid, from);
    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (err: any) {
    console.error('[TwilioWebhook] Error:', err);
    return new NextResponse(`<Response><Say>An error occurred.</Say></Response>`, {
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}
