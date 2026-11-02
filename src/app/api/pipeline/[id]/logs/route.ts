import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const logs = store.getProjectLogs(id);
  const project = store.getProjectById(id);

  return NextResponse.json({
    status: project?.status || 'IDLE',
    progress: project?.progressPercent || 0,
    currentStep: project?.currentStepMessage || '',
    logs,
  });
}
