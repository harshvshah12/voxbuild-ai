import { NextRequest, NextResponse } from 'next/server';
import { notifications } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const dummyProject = {
      id: 'test-proj',
      name: 'LuxeStay Hotel Platform',
      slug: 'luxestay-hotel',
      callId: 'call-test',
      status: 'DEPLOYED' as const,
      progressPercent: 100,
      currentStepMessage: 'Test deployment notification',
      specification: {} as any,
      rawTranscript: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      githubRepoUrl: 'https://github.com/harshvshah12/luxestay-hotel',
      vercelDeploymentUrl: 'https://luxestay-hotel.vercel.app',
      buildLogs: [],
      retryCount: 0,
      workspacePath: '',
    };

    const res = await notifications.notifyDeploymentSuccess(dummyProject);
    return NextResponse.json({ success: true, res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
