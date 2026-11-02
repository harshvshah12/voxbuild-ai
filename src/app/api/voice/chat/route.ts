import { NextRequest, NextResponse } from 'next/server';
import { sarvam } from '@/lib/sarvam';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userMessage, languageCode = 'en-IN' } = body;

    const systemPrompt = `You are the VoxBuild AI Voice Agent — an elite, friendly software development consultant and architect.
Your goal is to understand what kind of website the user wants to build.
You speak naturally, concisely (1-3 sentences max per turn, perfect for voice telephony), and warmly.
You can converse in English, Hindi, Marathi, or Hinglish depending on what language the user speaks.
Ask intelligent questions about their design preferences, colors, theme (dark/light), features, authentication, database (e.g. Supabase), and target audience.
When the user indicates they are done describing requirements, warmly tell them:
"Excellent! I have all your requirements. I'm ready to start building your website as soon as you hang up the call."`;

    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        chatMessages.push({
          role: m.speaker === 'ai' ? 'assistant' : 'user',
          content: m.text,
        });
      }
    }

    if (userMessage) {
      chatMessages.push({ role: 'user', content: userMessage });
    }

    // Call Sarvam LLM
    const chatRes = await sarvam.chatCompletion(chatMessages, {
      model: process.env.SARVAM_LLM_MODEL || 'sarvam-105b-conversations',
      temperature: 0.3,
      maxTokens: 250,
    });

    const replyText = chatRes.content || 'Understood. What other features would you like on your website?';

    // Synthesize audio using Sarvam Bulbul:v3
    let audioBase64: string | null = null;
    try {
      const ttsRes = await sarvam.synthesizeSpeech(replyText, {
        languageCode,
        speaker: 'aditya',
        model: 'bulbul:v3',
      });
      audioBase64 = ttsRes.audioBase64;
    } catch (ttsErr: any) {
      console.warn('[VoiceChat] TTS synthesis warning:', ttsErr.message);
    }

    return NextResponse.json({
      text: replyText,
      audioBase64,
      model: process.env.SARVAM_LLM_MODEL || 'sarvam-105b-conversations',
      speaker: 'aditya',
    });
  } catch (err: any) {
    console.error('[VoiceChat] Route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
