import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const settings = store.getSettings();
  // Mask sensitive tokens for client safety
  const safeSettings = {
    ...settings,
    sarvamApiKey: settings.sarvamApiKey ? `${settings.sarvamApiKey.slice(0, 8)}...${settings.sarvamApiKey.slice(-4)}` : '',
    githubToken: settings.githubToken ? `${settings.githubToken.slice(0, 6)}...` : '',
    vercelToken: settings.vercelToken ? `${settings.vercelToken.slice(0, 6)}...` : '',
  };
  return NextResponse.json(safeSettings);
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();
    const current = store.getSettings();

    // Preserve secrets if not updated
    if (updates.sarvamApiKey && updates.sarvamApiKey.includes('...')) {
      delete updates.sarvamApiKey;
    }
    if (updates.githubToken && updates.githubToken.includes('...')) {
      delete updates.githubToken;
    }
    if (updates.vercelToken && updates.vercelToken.includes('...')) {
      delete updates.vercelToken;
    }

    const merged = { ...current, ...updates };
    store.saveSettings(merged);

    return NextResponse.json({ success: true, settings: merged });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
