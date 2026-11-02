import 'dotenv/config';
import fs from 'fs';
import path from 'path';

export interface SarvamChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface SarvamTtsOptions {
  speaker?: string;
  languageCode?: string;
  model?: string;
}

export class SarvamService {
  private apiKey: string;
  private baseUrl = 'https://api.sarvam.ai';

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[SarvamService] Warning: SARVAM_API_KEY is not defined in environment variables.');
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Convert Speech to Text using Sarvam Saaras (v3 / v4)
   */
  async transcribeAudio(
    audioBuffer: Buffer,
    fileName = 'audio.wav',
    languageCode = 'unknown'
  ): Promise<{ transcript: string; languageCode: string; durationEstimate: number }> {
    if (!this.apiKey) {
      throw new Error('Sarvam API key is required for Speech-to-Text.');
    }

    const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('model', process.env.SARVAM_STT_MODEL || 'saaras:v3');
    if (languageCode && languageCode !== 'unknown') {
      formData.append('language_code', languageCode);
    }

    const response = await fetch(`${this.baseUrl}/speech-to-text`, {
      method: 'POST',
      headers: {
        'api-subscription-key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam STT error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      transcript: data.transcript || '',
      languageCode: data.language_code || 'unknown',
      durationEstimate: audioBuffer.length / 32000, // rough audio duration estimate
    };
  }

  /**
   * Convert Text to Speech using Sarvam Bulbul (v3)
   */
  async synthesizeSpeech(
    text: string,
    options?: SarvamTtsOptions
  ): Promise<{ audioBase64: string; format: string }> {
    if (!this.apiKey) {
      throw new Error('Sarvam API key is required for Text-to-Speech.');
    }

    const targetLang = options?.languageCode || process.env.SARVAM_LANGUAGE_CODE || 'en-IN';
    const speaker = options?.speaker || process.env.SARVAM_SPEAKER || 'aditya';
    const model = options?.model || process.env.SARVAM_VOICE_MODEL || 'bulbul:v3';

    // Truncate text if exceeds single utterance limit
    const cleanedText = text.slice(0, 1000);

    const response = await fetch(`${this.baseUrl}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify({
        inputs: [cleanedText],
        target_language_code: targetLang,
        speaker: speaker,
        model: model,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam TTS error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (!data.audios || data.audios.length === 0) {
      throw new Error('Sarvam TTS returned empty audio list.');
    }

    return {
      audioBase64: data.audios[0],
      format: 'audio/wav',
    };
  }

  /**
   * Conversational completion & reasoning using Sarvam LLM models
   */
  async chatCompletion(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options?: SarvamChatOptions
  ): Promise<{ content: string; reasoning?: string; usage?: any }> {
    if (!this.apiKey) {
      throw new Error('Sarvam API key is required for Chat Completion.');
    }

    const model = options?.model || process.env.SARVAM_LLM_MODEL || 'sarvam-105b-conversations';
    const maxTokens = options?.maxTokens || 2048;
    const temperature = options?.temperature ?? 0.3;

    const body: Record<string, any> = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    };

    if (options?.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam Chat error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const message = choice?.message;

    return {
      content: message?.content || '',
      reasoning: message?.reasoning_content || undefined,
      usage: data.usage,
    };
  }
}

export const sarvam = new SarvamService();
