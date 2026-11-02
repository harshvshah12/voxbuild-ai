import { NextRequest, NextResponse } from 'next/server';
import { sarvam } from '@/lib/sarvam';

export async function POST(req: NextRequest) {
  try {
    const { text, languageCode, speaker } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const tts = await sarvam.synthesizeSpeech(text, {
      languageCode: languageCode || 'en-IN',
      speaker: speaker || 'aditya',
      model: 'bulbul:v3',
    });

    return NextResponse.json(tts);
  } catch (err: any) {
    console.error('[Synthesize] Route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
