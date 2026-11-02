import fs from 'fs';
import path from 'path';
import os from 'os';
import { ProjectRecord, CallRecord, SystemSettings, BuildLogEntry } from '@/types';

// Use os.tmpdir() fallback if process.cwd() is read-only (e.g. Vercel Serverless)
let DATA_DIR = path.join(process.cwd(), 'src', 'data');
let LOGS_DIR = path.join(DATA_DIR, 'logs');

// In-memory cache for ultra-fast and resilient state persistence
const memoryProjects = new Map<string, ProjectRecord>();
const memoryCalls = new Map<string, CallRecord>();
const memoryLogs = new Map<string, BuildLogEntry[]>();

function ensureDirectories() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
  } catch (err) {
    // Switch to temp directory if root is read-only
    DATA_DIR = path.join(os.tmpdir(), 'voxbuild-data');
    LOGS_DIR = path.join(DATA_DIR, 'logs');
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
    } catch (e) {
      console.warn('[DataStore] Operating in pure in-memory mode.');
    }
  }
}

export class DataStore {
  constructor() {
    ensureDirectories();
    this.hydrateMemory();
  }

  private hydrateMemory() {
    try {
      const pFile = path.join(DATA_DIR, 'projects.json');
      if (fs.existsSync(pFile)) {
        const list: ProjectRecord[] = JSON.parse(fs.readFileSync(pFile, 'utf-8'));
        list.forEach((p) => memoryProjects.set(p.id, p));
      }

      const cFile = path.join(DATA_DIR, 'calls.json');
      if (fs.existsSync(cFile)) {
        const list: CallRecord[] = JSON.parse(fs.readFileSync(cFile, 'utf-8'));
        list.forEach((c) => memoryCalls.set(c.id, c));
      }
    } catch (e) {
      // ignore
    }
  }

  // --- PROJECTS ---
  getProjects(): ProjectRecord[] {
    const list = Array.from(memoryProjects.values());
    if (list.length > 0) {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const pFile = path.join(DATA_DIR, 'projects.json');
      if (fs.existsSync(pFile)) {
        const content = fs.readFileSync(pFile, 'utf-8');
        const parsed: ProjectRecord[] = JSON.parse(content);
        parsed.forEach((p) => memoryProjects.set(p.id, p));
        return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.error('[DataStore] Error reading projects:', err);
    }
    return [];
  }

  getProjectById(id: string): ProjectRecord | undefined {
    if (memoryProjects.has(id)) {
      return memoryProjects.get(id);
    }
    const projects = this.getProjects();
    return projects.find((p) => p.id === id);
  }

  saveProject(project: ProjectRecord): void {
    ensureDirectories();
    const updated = { ...project, updatedAt: new Date().toISOString() };
    memoryProjects.set(project.id, updated);

    try {
      const pFile = path.join(DATA_DIR, 'projects.json');
      const all = Array.from(memoryProjects.values());
      fs.writeFileSync(pFile, JSON.stringify(all, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[DataStore] Failed to write projects to disk, preserved in memory.');
    }
  }

  updateProjectStatus(
    id: string,
    status: ProjectRecord['status'],
    stepMessage: string,
    progressPercent: number,
    log?: BuildLogEntry
  ): ProjectRecord | undefined {
    const p = this.getProjectById(id);
    if (!p) return undefined;

    p.status = status;
    p.currentStepMessage = stepMessage;
    p.progressPercent = progressPercent;
    p.updatedAt = new Date().toISOString();

    if (log) {
      if (!p.buildLogs) p.buildLogs = [];
      p.buildLogs.push(log);
      this.appendProjectLog(id, log);
    }

    this.saveProject(p);
    return p;
  }

  // --- CALLS ---
  getCalls(): CallRecord[] {
    const list = Array.from(memoryCalls.values());
    if (list.length > 0) {
      return list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    }

    try {
      const cFile = path.join(DATA_DIR, 'calls.json');
      if (fs.existsSync(cFile)) {
        const content = fs.readFileSync(cFile, 'utf-8');
        const parsed: CallRecord[] = JSON.parse(content);
        parsed.forEach((c) => memoryCalls.set(c.id, c));
        return parsed.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      }
    } catch (err) {
      console.error('[DataStore] Error reading calls:', err);
    }
    return [];
  }

  getCallById(id: string): CallRecord | undefined {
    return memoryCalls.get(id) || this.getCalls().find((c) => c.id === id);
  }

  saveCall(call: CallRecord): void {
    ensureDirectories();
    memoryCalls.set(call.id, call);
    try {
      const cFile = path.join(DATA_DIR, 'calls.json');
      fs.writeFileSync(cFile, JSON.stringify(Array.from(memoryCalls.values()), null, 2), 'utf-8');
    } catch (e) {
      console.warn('[DataStore] Failed to write calls to disk, preserved in memory.');
    }
  }

  // --- LOGS ---
  appendProjectLog(projectId: string, log: BuildLogEntry): void {
    if (!memoryLogs.has(projectId)) {
      memoryLogs.set(projectId, []);
    }
    memoryLogs.get(projectId)!.push(log);

    try {
      ensureDirectories();
      const logFile = path.join(LOGS_DIR, `${projectId}.json`);
      fs.writeFileSync(logFile, JSON.stringify(memoryLogs.get(projectId)!, null, 2), 'utf-8');
    } catch {
      // preserved in memory
    }
  }

  getProjectLogs(projectId: string): BuildLogEntry[] {
    if (memoryLogs.has(projectId)) {
      return memoryLogs.get(projectId)!;
    }
    try {
      const logFile = path.join(LOGS_DIR, `${projectId}.json`);
      if (fs.existsSync(logFile)) {
        const logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        memoryLogs.set(projectId, logs);
        return logs;
      }
    } catch {
      // ignore
    }
    return [];
  }

  // --- SETTINGS ---
  getSettings(): SystemSettings {
    return {
      sarvamApiKey: process.env.SARVAM_API_KEY || '',
      sarvamVoiceModel: process.env.SARVAM_VOICE_MODEL || 'bulbul:v3',
      sarvamSttModel: process.env.SARVAM_STT_MODEL || 'saaras:v3',
      sarvamLlmModel: process.env.SARVAM_LLM_MODEL || 'sarvam-105b-conversations',
      sarvamSpeaker: process.env.SARVAM_SPEAKER || 'aditya',
      sarvamLanguageCode: process.env.SARVAM_LANGUAGE_CODE || 'en-IN',
      telephonyProvider: (process.env.TELEPHONY_PROVIDER as any) || 'web-terminal',
      githubToken: process.env.GITHUB_TOKEN || '',
      githubUsername: process.env.GITHUB_USERNAME || 'harshvshah12',
      vercelToken: process.env.VERCEL_TOKEN || '',
      notificationChannels: {
        whatsapp: true,
        whatsappNumber: process.env.WHATSAPP_PHONE_NUMBER || '+919876543210',
        whatsappApiKey: process.env.WHATSAPP_ACCESS_TOKEN,
        email: true,
        emailAddress: process.env.NOTIFICATION_EMAIL || 'harshvshah2019@gmail.com',
        dashboardToast: true,
      },
      usage: {
        totalCalls: Math.max(1, memoryCalls.size),
        totalAudioSeconds: 95,
        totalTokens: 2450,
        estimatedCostInr: 18.5,
        monthlyBudgetInr: 5000,
      },
    };
  }

  saveSettings(settings: SystemSettings): void {
    // Settings can be updated in memory
    try {
      ensureDirectories();
      const sFile = path.join(DATA_DIR, 'settings.json');
      fs.writeFileSync(sFile, JSON.stringify(settings, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }
}

export const store = new DataStore();
