'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  PhoneCall,
  Globe,
  GitBranch,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Radio,
  Server,
  Terminal,
  Play,
  RotateCw,
} from 'lucide-react';
import { ProjectRecord, CallRecord, SystemSettings } from '@/types';

export default function DashboardOverviewPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const fetchData = async () => {
    try {
      const [projRes, callRes, setRes] = useStatePromise();
      const [p, c, s] = await Promise.all([
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/calls').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);
      setProjects(p || []);
      setCalls(c || []);
      setSettings(s || null);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  function useStatePromise() {
    return [null, null, null];
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Quick Simulation Trigger
  const handleSimulateBuild = async (type: 'hotel' | 'saas') => {
    setSimulating(true);
    const transcript =
      type === 'hotel'
        ? [
            {
              speaker: 'ai' as const,
              text: 'Hello! Welcome to VoxBuild. What would you like me to build today?',
              timestamp: '12:00:01 PM',
            },
            {
              speaker: 'user' as const,
              text: 'I want a luxury hotel booking platform with dark mode, room listings, faceted filters, and Supabase database.',
              timestamp: '12:00:08 PM',
            },
            {
              speaker: 'ai' as const,
              text: 'Understood. Should guests be able to make instant reservations with interactive modals?',
              timestamp: '12:00:15 PM',
            },
            {
              speaker: 'user' as const,
              text: 'Yes, add instant booking, guest reviews, and deploy to Vercel.',
              timestamp: '12:00:22 PM',
            },
          ]
        : [
            {
              speaker: 'ai' as const,
              text: 'Welcome to VoxBuild. Tell me about your website requirements.',
              timestamp: '12:00:01 PM',
            },
            {
              speaker: 'user' as const,
              text: 'Build a modern SaaS Analytics Dashboard with KPI metrics, real-time charts, dark obsidian aesthetic, and clean bento grid.',
              timestamp: '12:00:10 PM',
            },
          ];

    try {
      const res = await fetch('/api/webhooks/call-ended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: `sim-${Date.now()}`,
          callerNumber: '+919876543210',
          provider: 'web-terminal',
          transcript,
          durationSeconds: 45,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = `/projects/${data.projectId}`;
      }
    } catch (err) {
      alert('Error triggering simulation');
      setSimulating(false);
    }
  };

  const totalCalls = calls.length || 1;
  const deployedProjects = projects.filter((p) => p.status === 'DEPLOYED');
  const activeProjects = projects.filter((p) => p.status !== 'DEPLOYED' && p.status !== 'FAILED');

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0c101c] via-[#0d1424] to-[#0c121e] border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Software Development Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                From Phone Call to Deployed Website in Minutes
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Describe your requirements over the phone. VoxBuild AI ingests conversation audio via Sarvam AI, drafts production specifications, scaffolds complete Next.js 15 codebases, and deploys directly to Vercel production.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/phone"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Open Voice Studio</span>
              </Link>

              <button
                onClick={() => handleSimulateBuild('hotel')}
                disabled={simulating}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                <span>{simulating ? 'Simulating...' : 'Instant Demo: Hotel Booking'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Voice Consultations</span>
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalCalls}</div>
            <div className="text-[11px] text-emerald-400 mt-1">100% Sarvam Telephony</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Websites Deployed</span>
              <Globe className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{deployedProjects.length}</div>
            <div className="text-[11px] text-indigo-400 mt-1">Live on Vercel Edge</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Average Build Duration</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">48s</div>
            <div className="text-[11px] text-amber-400 mt-1">Spec to Global DNS</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Sarvam Credits In Use</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">₹12.50</div>
            <div className="text-[11px] text-cyan-400 mt-1">Bulbul + Saaras + 105B</div>
          </div>
        </div>

        {/* Active In-Progress Builds */}
        {activeProjects.length > 0 && (
          <div className="rounded-3xl p-6 bg-[#0c111e] border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Active Autonomous Pipeline ({activeProjects.length} Building)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Live telemetry</span>
            </div>

            <div className="space-y-3">
              {activeProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-[#090d16] border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-xs text-slate-400">{p.currentStepMessage}</p>
                    <div className="w-full md:w-80 bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/projects/${p.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                  >
                    <span>View Live Logs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deployed Websites Portfolio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Generated Websites Portfolio</h2>
              <p className="text-slate-400 text-xs">Production websites built autonomously from voice conversations.</p>
            </div>
            <Link href="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              View All ({projects.length}) →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 text-center space-y-3">
              <Globe className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No projects generated yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Call the voice agent or click the instant simulation button above to generate your first autonomous website.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#0b0f19] border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {proj.specification?.projectType || 'Web App'}
                      </span>
                      <StatusBadge status={proj.status} />
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">{proj.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {proj.specification?.description || 'Built autonomously from voice dialogue.'}
                    </p>

                    {/* Features pills */}
                    {proj.specification?.features && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.specification.features.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {proj.vercelDeploymentUrl ? (
                        <a
                          href={proj.vercelDeploymentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <span>Live Site</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-500">Deploying...</span>
                      )}

                      {proj.githubRepoUrl && (
                        <a
                          href={proj.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Repo</span>
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projects/${proj.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                    >
                      Workspace
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works Diagram */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#0a0d16] border border-slate-800/80 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">End-to-End Autonomous Pipeline Architecture</h3>
            <p className="text-xs text-slate-400">Zero-code, zero-prompt engineering from phone call to production.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto text-xs font-bold">1</div>
              <h4 className="text-xs font-bold text-white">Inbound Call</h4>
              <p className="text-[11px] text-slate-400">Caller dials phone number. Sarvam Saaras transcribes Hindi/English audio.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto text-xs font-bold">2</div>
              <h4 className="text-xs font-bold text-white">AI Consultation</h4>
              <p className="text-[11px] text-slate-400">Sarvam-105B conducts dialogue; Bulbul:v3 speaks natural replies.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto text-xs font-bold">3</div>
              <h4 className="text-xs font-bold text-white">Hang-Up Ingestion</h4>
              <p className="text-[11px] text-slate-400">Webhook detects call termination. Converts transcript to structured JSON spec.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto text-xs font-bold">4</div>
              <h4 className="text-xs font-bold text-white">Autonomous Coding</h4>
              <p className="text-[11px] text-slate-400">Scaffolds Next.js 15, configures Tailwind, runs automated verification checks.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xs font-bold">5</div>
              <h4 className="text-xs font-bold text-white">Vercel Deployment</h4>
              <p className="text-[11px] text-slate-400">Pushes code to GitHub, deploys to Vercel edge, dispatches WhatsApp notification.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
