'use client';

import React, { useState, useEffect } from 'react';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import {
  Settings,
  ShieldCheck,
  Save,
  Check,
  Key,
  Globe,
  Radio,
  GitBranch,
  Bell,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { SystemSettings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (e) {
      alert('Error saving settings');
    }
  };

  const handleTestNotification = async () => {
    setTestingNotification(true);
    setNotificationStatus(null);
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' });
      if (res.ok) {
        setNotificationStatus('Notification successfully dispatched to WhatsApp & Dashboard!');
      } else {
        setNotificationStatus('Notice: WhatsApp dispatch simulated (configure API token for live Meta WhatsApp delivery).');
      }
    } catch (err: any) {
      setNotificationStatus(`Notification error: ${err.message}`);
    } finally {
      setTestingNotification(false);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex flex-col bg-[#07090e]">
        <DashboardNavbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Loading platform configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <DashboardNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice AI & Vercel Autonomous Deployment Engine Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Settings</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Manage Sarvam AI credentials, GitHub repository automation, and autonomous Vercel production edge deployments.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Sarvam AI Provider */}
          <div className="rounded-3xl p-6 bg-[#0b0f19] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0e18] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sarvam AI Configuration</h3>
                  <p className="text-xs text-slate-400">Primary voice and language provider for conversational website building</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                API Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Sarvam API Key</label>
                <input
                  type="text"
                  value={settings.sarvamApiKey}
                  onChange={(e) => setSettings({ ...settings, sarvamApiKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Configured from .env (sk_5ko0fscu...)</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Text-to-Speech Model (Bulbul)</label>
                <select
                  value={settings.sarvamVoiceModel}
                  onChange={(e) => setSettings({ ...settings, sarvamVoiceModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="bulbul:v3">Bulbul v3 (Default Neural)</option>
                  <option value="bulbul:v2">Bulbul v2</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Speech-to-Text Model (Saaras)</label>
                <select
                  value={settings.sarvamSttModel}
                  onChange={(e) => setSettings({ ...settings, sarvamSttModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="saaras:v3">Saaras v3 (Multilingual Indian Languages)</option>
                  <option value="saaras:v4">Saaras v4</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Conversational LLM Model</label>
                <select
                  value={settings.sarvamLlmModel}
                  onChange={(e) => setSettings({ ...settings, sarvamLlmModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="sarvam-105b-conversations">Sarvam 105B Conversations (Optimized Dialogue)</option>
                  <option value="sarvam-105b">Sarvam 105B (Deep Reasoning)</option>
                  <option value="glm5.3-flash">GLM 5.3 Flash (Ultra Fast)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Autonomous Deployments (GitHub & Vercel) */}
          <div className="rounded-3xl p-6 bg-[#0b0f19] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0e18] rounded-[10px] flex items-center justify-center">
                    <Globe className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Vercel Production Deployment & GitHub Engine</h3>
                  <p className="text-xs text-slate-400">Zero-confirmation automated repo creation, code commits, and Vercel edge deployment</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                harshvshah12 Pre-Authorized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Vercel Production Token</label>
                <input
                  type="text"
                  value={settings.vercelToken}
                  onChange={(e) => setSettings({ ...settings, vercelToken: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Vercel Account: harshvshah12 (Active)</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Personal Access Token (PAT)</label>
                <input
                  type="text"
                  value={settings.githubToken}
                  onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">GitHub Account: harshvshah12 (Active)</span>
              </div>
            </div>
          </div>

          {/* Section 3: In-Browser Simulated Calling Agent Details */}
          <div className="rounded-3xl p-6 bg-[#0b0f19] border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0e18] rounded-[10px] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">In-Browser Simulated Calling Agent</h3>
                <p className="text-xs text-slate-400">Direct real-time two-way audio running natively without rented telephony phone numbers</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                <strong>No Phone Number Required:</strong> The calling agent is simulated directly inside VoxBuild AI via browser WebRTC/WebAudio and Sarvam APIs.
              </p>
              <p className="text-slate-400">
                You speak directly into your computer/phone microphone, Sarvam Saaras transcribes in real-time, Sarvam-105B reasons through your architecture, and Bulbul synthesizes low-latency human audio back to your speaker. When you hang up, it immediately triggers the autonomous Vercel build and deployment!
              </p>
            </div>
          </div>

          {/* Section 4: Notifications (WhatsApp & Email) */}
          <div className="rounded-3xl p-6 bg-[#0b0f19] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0e18] rounded-[10px] flex items-center justify-center">
                    <Bell className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Post-Deployment Notifications</h3>
                  <p className="text-xs text-slate-400">Receive instant WhatsApp alerts with live website URL when build succeeds</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp Notification Number</label>
                <input
                  type="text"
                  value={settings.notificationChannels?.whatsappNumber || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notificationChannels: {
                        ...settings.notificationChannels,
                        whatsappNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notification Email</label>
                <input
                  type="email"
                  value={settings.notificationChannels?.emailAddress || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notificationChannels: {
                        ...settings.notificationChannels,
                        emailAddress: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={handleTestNotification}
                disabled={testingNotification}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
              >
                <RotateCw className={`w-3.5 h-3.5 ${testingNotification ? 'animate-spin' : ''}`} />
                <span>Test Dispatch Notification</span>
              </button>

              {notificationStatus && (
                <span className="text-xs text-emerald-400 font-medium">
                  {notificationStatus}
                </span>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
