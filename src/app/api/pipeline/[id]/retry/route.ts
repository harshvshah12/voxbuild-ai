import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/lib/engine/orchestrator';
import { store } from '@/lib/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = store.getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  project.retryCount += 1;
  project.status = 'CALL_COMPLETED';
  project.progressPercent = 10;
  project.currentStepMessage = `Retrying build (attempt #${project.retryCount})...`;
  store.saveProject(project);

  setTimeout(() => {
    orchestrator.runPipeline(id).catch(console.error);
  }, 100);

  return NextResponse.json({ success: true, message: 'Retry initiated', project });
}
