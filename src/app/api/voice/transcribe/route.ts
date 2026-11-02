import { NextRequest, NextResponse } from 'next/server';
import { sarvam } from '@/lib/sarvam';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stt = await sarvam.transcribeAudio(buffer, 'mic_input.wav');

    return NextResponse.json({
      transcript: stt.transcript,
      languageCode: stt.languageCode,
      duration: stt.durationEstimate,
    });
  } catch (err: any) {
    console.error('[Transcribe] Route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
