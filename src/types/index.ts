export type ProjectStatus =
  | 'IDLE'
  | 'CALL_CONNECTED'
  | 'CALL_IN_PROGRESS'
  | 'CALL_COMPLETED'
  | 'TRANSCRIPT_PROCESSING'
  | 'SPECIFICATION_READY'
  | 'BUILDING'
  | 'TESTING'
  | 'DEPLOYING'
  | 'DEPLOYED'
  | 'FAILED';

export interface CallRecord {
  id: string;
  callerNumber?: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  status: 'active' | 'completed' | 'abandoned' | 'COMPLETED';
  provider: 'sarvam-byot' | 'twilio' | 'exotel' | 'web-terminal' | 'browser-webaudio';
  language?: string;
  languageDetected?: string;
  audioRecordingUrl?: string;
  transcript: TranscriptMessage[] | any[];
  extractedSpec?: ProjectSpecification;
  projectId?: string;
  metadata?: Record<string, any>;
}

export interface TranscriptMessage {
  speaker: 'user' | 'ai';
  text: string;
  timestamp: string;
  languageCode?: string;
  confidence?: number;
}

export interface ProjectSpecification {
  projectName: string;
  slug: string;
  tagline: string;
  description: string;
  projectType: string;
  targetAudience: string;
  design: {
    theme: 'dark' | 'light' | 'midnight-obsidian' | 'luxury-gold' | 'cyberpunk' | 'clean-white';
    primaryColor: string;
    accentColor: string;
    style: string;
    typography: string;
    animations: boolean;
    responsive: boolean;
  };
  features: string[];
  pages: {
    name: string;
    route: string;
    description: string;
    sections: string[];
  }[];
  components: {
    name: string;
    purpose: string;
    propsDescription?: string;
  }[];
  backend: {
    needsDatabase: boolean;
    databaseType?: 'supabase' | 'postgres' | 'local-json';
    needsAuth: boolean;
    authProvider?: 'supabase' | 'next-auth' | 'mock';
    hasAdminDashboard: boolean;
    apiEndpoints: string[];
  };
  mockDataRequirements?: string[];
  deploymentRequested: boolean;
}

export interface ProjectRecord {
  id: string;
  name: string;
  slug: string;
  callId: string;
  status: ProjectStatus;
  progressPercent: number;
  currentStepMessage: string;
  specification: ProjectSpecification;
  rawTranscript: TranscriptMessage[];
  createdAt: string;
  updatedAt: string;
  githubRepoUrl?: string;
  githubRepoName?: string;
  vercelDeploymentUrl?: string;
  vercelProjectId?: string;
  buildLogs: BuildLogEntry[];
  error?: string;
  retryCount: number;
  workspacePath: string;
}

export interface BuildLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  phase: 'INGEST' | 'SPEC' | 'SCAFFOLD' | 'BUILD' | 'TEST' | 'DEPLOY' | 'NOTIFY';
  message: string;
  details?: string;
}

export interface SystemSettings {
  sarvamApiKey: string;
  sarvamVoiceModel: string;
  sarvamSttModel: string;
  sarvamLlmModel: string;
  sarvamSpeaker: string;
  sarvamLanguageCode: string;
  telephonyProvider: 'sarvam-byot' | 'twilio' | 'exotel' | 'web-terminal';
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  exotelApiKey?: string;
  exotelApiToken?: string;
  exotelAccountSid?: string;
  exotelCallerId?: string;
  githubToken?: string;
  githubUsername?: string;
  vercelToken?: string;
  vercelTeamId?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceKey?: string;
  notificationChannels: {
    whatsapp: boolean;
    whatsappNumber?: string;
    whatsappApiKey?: string;
    email: boolean;
    emailAddress?: string;
    dashboardToast: boolean;
  };
  usage: {
    totalCalls: number;
    totalAudioSeconds: number;
    totalTokens: number;
    estimatedCostInr: number;
    monthlyBudgetInr: number;
  };
}
