import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { orchestrator } from '@/lib/engine/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('[SarvamWebhook] Received payload:', JSON.stringify(payload).slice(0, 300));

    // Sarvam deployment webhook passes call details & transcript
    const callId = payload.call_id || payload.session_id || `sarvam-${Date.now()}`;
    const callerNumber = payload.caller_id || payload.phone_number || '+919876543210';
    const duration = payload.duration_seconds || payload.duration || 60;

    let transcript = [];
    if (Array.isArray(payload.messages)) {
      transcript = payload.messages.map((m: any) => ({
        speaker: m.role === 'assistant' ? 'ai' : 'user',
        text: m.content || m.text,
        timestamp: m.timestamp || new Date().toISOString(),
      }));
    } else if (payload.transcript) {
      transcript = [
        {
          speaker: 'user' as const,
          text: typeof payload.transcript === 'string' ? payload.transcript : JSON.stringify(payload.transcript),
          timestamp: new Date().toISOString(),
        },
      ];
    }

    if (transcript.length === 0) {
      return NextResponse.json({ received: true, note: 'No transcript provided' });
    }

    // Call unified webhook handler internal logic
    const projectId = `proj-${Date.now()}`;
    const project = {
      id: projectId,
      name: 'Sarvam Voice Generated App',
      slug: `sarvam-app-${Date.now()}`,
      callId,
      status: 'CALL_COMPLETED' as const,
      progressPercent: 10,
      currentStepMessage: 'Sarvam webhook received. Parsing architecture...',
      specification: {} as any,
      rawTranscript: transcript,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildLogs: [],
      retryCount: 0,
      workspacePath: '',
    };

    store.saveProject(project);

    setTimeout(() => {
      orchestrator.runPipeline(projectId).catch(console.error);
    }, 100);

    return NextResponse.json({ success: true, projectId, status: 'PROCESSING' });
  } catch (err: any) {
    console.error('[SarvamWebhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
