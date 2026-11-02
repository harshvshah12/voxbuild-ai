import { CallRecord, TranscriptMessage } from '@/types';
import { store } from './store';
import { sarvam } from './sarvam';

export class TelephonyService {
  /**
   * Handle incoming Twilio Voice webhook
   */
  generateTwilioTwiML(callSid: string, fromNumber: string): string {
    // Register active call session
    const callRecord: CallRecord = {
      id: callSid,
      callerNumber: fromNumber || '+919876543210',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      status: 'active',
      provider: 'twilio',
      transcript: [
        {
          speaker: 'ai',
          text: 'Hello! Welcome to VoxBuild AI. What kind of website would you like me to build today?',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    store.saveCall(callRecord);

    // Return TwiML with greeting and recording instruction
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="en-IN" voice="Polly.Aditi">Hello! Welcome to VoxBuild AI. What kind of website would you like me to build today?</Say>
  <Record action="/api/webhooks/twilio?action=recorded" method="POST" maxLength="120" playBeep="true" />
</Response>`;
  }

  /**
   * Process completed Twilio recording webhook
   */
  async handleTwilioRecording(callSid: string, recordingUrl: string): Promise<CallRecord | null> {
    const call = store.getCallById(callSid);
    if (!call) return null;

    call.audioRecordingUrl = recordingUrl;
    call.status = 'completed';
    call.endedAt = new Date().toISOString();

    // Fetch recording audio bytes and transcribe via Sarvam Saaras
    try {
      const audioRes = await fetch(recordingUrl);
      if (audioRes.ok) {
        const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
        const stt = await sarvam.transcribeAudio(audioBuffer, 'twilio_call.wav');

        call.transcript.push({
          speaker: 'user',
          text: stt.transcript,
          timestamp: new Date().toISOString(),
          languageCode: stt.languageCode,
        });

        call.languageDetected = stt.languageCode;
      }
    } catch (err: any) {
      console.error('[Telephony] Error transcribing Twilio audio:', err);
    }

    store.saveCall(call);
    return call;
  }

  /**
   * Handle Exotel Inbound Passthru
   */
  generateExotelPassthru(callSid: string, from: string): Record<string, any> {
    const callRecord: CallRecord = {
      id: callSid || `exo-${Date.now()}`,
      callerNumber: from || '+919876543210',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      status: 'active',
      provider: 'exotel',
      transcript: [
        {
          speaker: 'ai',
          text: 'Welcome to VoxBuild. Tell me what kind of website you want to build today.',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    store.saveCall(callRecord);

    return {
      select: 'stream',
      greeting: 'Welcome to VoxBuild AI.',
      status: 'ok',
    };
  }
}

export const telephony = new TelephonyService();
