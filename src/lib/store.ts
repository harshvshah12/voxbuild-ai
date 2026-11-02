import fs from 'fs';
import path from 'path';
import { ProjectRecord, CallRecord, SystemSettings, BuildLogEntry } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const CALLS_FILE = path.join(DATA_DIR, 'calls.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const LOGS_DIR = path.join(DATA_DIR, 'logs');

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

export class DataStore {
  constructor() {
    ensureDirectories();
  }

  // --- PROJECTS ---
  getProjects(): ProjectRecord[] {
    try {
      if (!fs.existsSync(PROJECTS_FILE)) return [];
      const content = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('[DataStore] Error reading projects:', err);
      return [];
    }
  }

  getProjectById(id: string): ProjectRecord | undefined {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id);
  }

  saveProject(project: ProjectRecord): void {
    ensureDirectories();
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift(project);
    }
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  }

  updateProjectStatus(
    id: string,
    status: ProjectRecord['status'],
    stepMessage: string,
    progressPercent: number,
    log?: BuildLogEntry
  ): ProjectRecord | undefined {
    const projects = this.getProjects();
    const p = projects.find((item) => item.id === id);
    if (!p) return undefined;

    p.status = status;
    p.currentStepMessage = stepMessage;
    p.progressPercent = progressPercent;
    p.updatedAt = new Date().toISOString();

    if (log) {
      p.buildLogs.push(log);
      this.appendProjectLog(id, log);
    }

    this.saveProject(p);
    return p;
  }

  // --- CALLS ---
  getCalls(): CallRecord[] {
    try {
      if (!fs.existsSync(CALLS_FILE)) return [];
      const content = fs.readFileSync(CALLS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('[DataStore] Error reading calls:', err);
      return [];
    }
  }

  getCallById(id: string): CallRecord | undefined {
    const calls = this.getCalls();
    return calls.find((c) => c.id === id);
  }

  saveCall(call: CallRecord): void {
    ensureDirectories();
    const calls = this.getCalls();
    const index = calls.findIndex((c) => c.id === call.id);
    if (index >= 0) {
      calls[index] = call;
    } else {
      calls.unshift(call);
    }
    fs.writeFileSync(CALLS_FILE, JSON.stringify(calls, null, 2), 'utf-8');
  }

  // --- LOGS ---
  appendProjectLog(projectId: string, log: BuildLogEntry): void {
    ensureDirectories();
    const logFile = path.join(LOGS_DIR, `${projectId}.json`);
    let logs: BuildLogEntry[] = [];
    if (fs.existsSync(logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      } catch {
        logs = [];
      }
    }
    logs.push(log);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf-8');
  }

  getProjectLogs(projectId: string): BuildLogEntry[] {
    const logFile = path.join(LOGS_DIR, `${projectId}.json`);
    if (!fs.existsSync(logFile)) return [];
    try {
      return JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    } catch {
      return [];
    }
  }

  // --- SETTINGS ---
  getSettings(): SystemSettings {
    const defaults: SystemSettings = {
      sarvamApiKey: process.env.SARVAM_API_KEY || '',
      sarvamVoiceModel: process.env.SARVAM_VOICE_MODEL || 'bulbul:v3',
      sarvamSttModel: process.env.SARVAM_STT_MODEL || 'saaras:v3',
      sarvamLlmModel: process.env.SARVAM_LLM_MODEL || 'sarvam-105b-conversations',
      sarvamSpeaker: process.env.SARVAM_SPEAKER || 'aditya',
      sarvamLanguageCode: process.env.SARVAM_LANGUAGE_CODE || 'en-IN',
      telephonyProvider: (process.env.TELEPHONY_PROVIDER as any) || 'web-terminal',
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
      exotelApiKey: process.env.EXOTEL_API_KEY,
      exotelApiToken: process.env.EXOTEL_API_TOKEN,
      exotelAccountSid: process.env.EXOTEL_ACCOUNT_SID,
      exotelCallerId: process.env.EXOTEL_CALLER_ID,
      githubToken: process.env.GITHUB_TOKEN || '',
      githubUsername: process.env.GITHUB_USERNAME || 'harshvshah12',
      vercelToken: process.env.VERCEL_TOKEN || '',
      vercelTeamId: process.env.VERCEL_TEAM_ID,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      notificationChannels: {
        whatsapp: true,
        whatsappNumber: process.env.WHATSAPP_PHONE_NUMBER || '+919876543210',
        whatsappApiKey: process.env.WHATSAPP_ACCESS_TOKEN,
        email: true,
        emailAddress: process.env.NOTIFICATION_EMAIL || 'harshvshah2019@gmail.com',
        dashboardToast: true,
      },
      usage: {
        totalCalls: 1,
        totalAudioSeconds: 45,
        totalTokens: 1420,
        estimatedCostInr: 12.5,
        monthlyBudgetInr: 5000,
      },
    };

    if (!fs.existsSync(SETTINGS_FILE)) {
      this.saveSettings(defaults);
      return defaults;
    }

    try {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...defaults, ...JSON.parse(content) };
    } catch {
      return defaults;
    }
  }

  saveSettings(settings: SystemSettings): void {
    ensureDirectories();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  }
}

export const store = new DataStore();
