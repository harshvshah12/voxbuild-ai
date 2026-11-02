import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { orchestrator } from '@/lib/engine/orchestrator';

export async function GET() {
  const projects = store.getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, projectName = 'Custom Voice Project', callerNumber = '+919876543210' } = body;

    const projectId = `proj-${Date.now()}`;
    const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const project = {
      id: projectId,
      name: projectName,
      slug,
      callId: `manual-${Date.now()}`,
      status: 'CALL_COMPLETED' as const,
      progressPercent: 10,
      currentStepMessage: 'Build initiated from studio dashboard...',
      specification: {} as any,
      rawTranscript: transcript || [
        {
          speaker: 'user' as const,
          text: `I want to build a ${projectName} with modern animations and Supabase integration.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildLogs: [],
      retryCount: 0,
      workspacePath: '',
    };

    store.saveProject(project);

    // Run in background
    setTimeout(() => {
      orchestrator.runPipeline(projectId).catch(console.error);
    }, 100);

    return NextResponse.json({ success: true, projectId, project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
