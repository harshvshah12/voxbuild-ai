import { NextRequest, NextResponse } from 'next/server';
import { CallRecord, ProjectRecord } from '@/types';
import { store } from '@/lib/store';
import { orchestrator } from '@/lib/engine/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      callId = `call-${Date.now()}`,
      callerNumber = '+919876543210',
      provider = 'web-terminal',
      transcript = [],
      durationSeconds = 60,
    } = body;

    if (!Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json({ error: 'Transcript messages are required' }, { status: 400 });
    }

    // 1. Record call
    const callRecord: CallRecord = {
      id: callId,
      callerNumber,
      startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds,
      status: 'completed',
      provider,
      transcript,
    };
    store.saveCall(callRecord);

    // 2. Derive project title
    const userWords = transcript
      .filter((t: any) => t.speaker === 'user')
      .map((t: any) => t.text)
      .join(' ');
    
    let tentativeName = 'Autonomous Web App';
    if (/hotel|booking|stay|resort/i.test(userWords)) tentativeName = 'LuxeStay Hotel Platform';
    else if (/ecommerce|store|shop|buy/i.test(userWords)) tentativeName = 'Aura Commerce Hub';
    else if (/portfolio|resume|agency/i.test(userWords)) tentativeName = 'Apex Creative Portfolio';
    else if (/saas|dashboard|analytics/i.test(userWords)) tentativeName = 'PulseMetrics Analytics';

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = tentativeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const project: ProjectRecord = {
      id: projectId,
      name: tentativeName,
      slug,
      callId,
      status: 'CALL_COMPLETED',
      progressPercent: 5,
      currentStepMessage: 'Call completed. Initializing autonomous coding agent...',
      specification: {
        projectName: tentativeName,
        slug,
        tagline: 'Autonomous website crafted from phone dialogue',
        description: 'Generating application from voice requirements...',
        projectType: 'Full-stack web application',
        targetAudience: 'Web Users',
        design: {
          theme: 'midnight-obsidian',
          primaryColor: '#6366f1',
          accentColor: '#10b981',
          style: 'Dark Obsidian Luxe & Bento Grid',
          typography: 'Inter',
          animations: true,
          responsive: true,
        },
        features: [],
        pages: [],
        components: [],
        backend: {
          needsDatabase: true,
          needsAuth: true,
          hasAdminDashboard: true,
          apiEndpoints: ['/api/data'],
        },
        deploymentRequested: true,
      },
      rawTranscript: transcript,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildLogs: [
        {
          timestamp: new Date().toISOString(),
          phase: 'INGEST',
          level: 'info',
          message: `Phone call ended (${durationSeconds}s). Autonomous pipeline dispatched.`,
        },
      ],
      retryCount: 0,
      workspacePath: '',
    };

    store.saveProject(project);

    // 3. Trigger autonomous development in background
    setTimeout(() => {
      orchestrator.runPipeline(projectId).catch((err) => {
        console.error(`[Webhook] Background orchestrator failure for ${projectId}:`, err);
      });
    }, 100);

    return NextResponse.json({
      success: true,
      projectId,
      status: 'CALL_COMPLETED',
      message: 'Autonomous development pipeline started.',
    });
  } catch (err: any) {
    console.error('[CallEndedWebhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
