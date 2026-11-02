import { orchestrator } from '../src/lib/engine/orchestrator.ts';
import { store } from '../src/lib/store.ts';

async function runTest() {
  console.log('=== STARTING VOXBUILD AI PIPELINE VERIFICATION TEST ===');

  const projectId = `proj-test-${Date.now()}`;
  const sampleTranscript = [
    {
      speaker: 'ai',
      text: 'Hello! Welcome to VoxBuild AI. What kind of website would you like me to build today?',
      timestamp: '12:00:01 PM',
    },
    {
      speaker: 'user',
      text: 'I want a luxury hotel booking platform called LuxeStay. It needs a dark obsidian aesthetic, room listings, faceted filters, instant booking modal, and Supabase integration.',
      timestamp: '12:00:10 PM',
    },
    {
      speaker: 'ai',
      text: 'Understood. Should guests be able to filter by sea view, private pool, and price brackets?',
      timestamp: '12:00:18 PM',
    },
    {
      speaker: 'user',
      text: 'Yes! And make sure it is responsive on mobile and deployed to Vercel.',
      timestamp: '12:00:26 PM',
    },
  ];

  const project = {
    id: projectId,
    name: 'LuxeStay Hotel Platform',
    slug: 'luxestay-hotel-platform',
    callId: `voice-${Date.now()}`,
    status: 'CALL_COMPLETED',
    progressPercent: 5,
    currentStepMessage: 'Call ended. Ingesting voice dialogue...',
    specification: {},
    rawTranscript: sampleTranscript,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    buildLogs: [],
    retryCount: 0,
    workspacePath: '',
  };

  store.saveProject(project);
  console.log(`[Test] Registered project ${projectId}. Triggering autonomous pipeline...`);

  const result = await orchestrator.runPipeline(projectId);
  console.log('=== PIPELINE EXECUTION COMPLETED ===');
  console.log('Project Status:', result.status);
  console.log('Specification Name:', result.specification?.projectName);
  console.log('GitHub URL:', result.githubRepoUrl);
  console.log('Vercel Live URL:', result.vercelDeploymentUrl);
  console.log('Total Logs:', result.buildLogs.length);
}

runTest().catch((err) => {
  console.error('[Test Failed]:', err);
  process.exit(1);
});
