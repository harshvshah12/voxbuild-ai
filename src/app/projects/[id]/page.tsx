'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  RotateCw,
  Terminal,
  FileCode2,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  Layers,
  Database,
  ShieldCheck,
  Palette,
  Radio,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { ProjectRecord, BuildLogEntry } from '@/types';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [logs, setLogs] = useState<BuildLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'spec' | 'transcript' | 'logs'>('logs');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const fetchProjectData = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        if (data.buildLogs) {
          setLogs(data.buildLogs);
        }
      }
    } catch (e) {
      console.error('Error fetching project:', e);
    }
  };

  useEffect(() => {
    fetchProjectData();
    const interval = setInterval(fetchProjectData, 2500);
    return () => clearInterval(interval);
  }, [projectId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const res = await fetch(`/api/pipeline/${projectId}/retry`, { method: 'POST' });
      if (res.ok) {
        fetchProjectData();
      }
    } catch (e) {
      alert('Error triggering retry');
    } finally {
      setRetrying(false);
    }
  };

  const copyLiveUrl = () => {
    if (project?.vercelDeploymentUrl) {
      navigator.clipboard.writeText(project.vercelDeploymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#07090e]">
        <DashboardNavbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Loading project workspace...
        </div>
      </div>
    );
  }

  const liveUrl = project.vercelDeploymentUrl || `https://${project.slug}.vercel.app`;

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <DashboardNavbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/projects"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Websites</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-xs text-slate-400 font-mono">{project.id}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>

            <p className="text-xs text-slate-400">{project.currentStepMessage}</p>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRetry}
              disabled={retrying || project.status === 'BUILDING' || project.status === 'DEPLOYING'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              <span>Retry Build</span>
            </button>

            {project.githubRepoUrl && (
              <a
                href={project.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub Repo</span>
              </a>
            )}

            {project.vercelDeploymentUrl && (
              <a
                href={project.vercelDeploymentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                <span>Open Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progressPercent}%` }}
          />
        </div>

        {/* Main Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Spec, Transcript, Logs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col rounded-3xl bg-[#0b0f19] border border-slate-800/80 overflow-hidden">
            {/* Tabs */}
            <div className="p-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Build Terminal ({logs.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('spec')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'spec' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Architecture Spec</span>
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'transcript' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Voice Transcript</span>
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[700px]">
              {activeTab === 'logs' ? (
                <div className="font-mono text-[11px] space-y-2">
                  {logs.length === 0 ? (
                    <div className="text-slate-500 py-6 text-center">Awaiting terminal telemetry...</div>
                  ) : (
                    logs.map((l, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg border ${
                          l.level === 'error'
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                            : l.level === 'warn'
                            ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                            : l.level === 'success'
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="font-bold uppercase tracking-wider text-indigo-400">
                            [{l.phase}]
                          </span>
                          <span>{new Date(l.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="font-semibold">{l.message}</div>
                        {l.details && (
                          <pre className="mt-1.5 p-2 rounded bg-black/50 text-[10px] text-slate-400 overflow-x-auto whitespace-pre-wrap">
                            {l.details}
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'spec' ? (
                <div className="space-y-5 text-xs text-slate-300">
                  {project.specification ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Project Identity
                        </span>
                        <div className="text-base font-bold text-white">{project.specification.projectName}</div>
                        <div className="text-slate-400">{project.specification.tagline}</div>
                        <p className="text-slate-400 mt-1 leading-relaxed">{project.specification.description}</p>
                      </div>

                      {/* Design Tokens */}
                      <div className="space-y-2 pt-3 border-t border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Design System & Aesthetic
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-500 block">Theme</span>
                            <span className="font-bold text-white capitalize">{project.specification.design?.theme}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-500 block">Visual World</span>
                            <span className="font-bold text-indigo-300">{project.specification.design?.style}</span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 pt-3 border-t border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Engineered Capabilities
                        </span>
                        <ul className="space-y-1.5">
                          {project.specification.features?.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pages Architecture */}
                      <div className="space-y-2 pt-3 border-t border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          App Router Pages
                        </span>
                        <div className="space-y-2">
                          {project.specification.pages?.map((p, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                              <div className="font-bold text-white flex items-center justify-between">
                                <span>{p.name}</span>
                                <span className="text-[10px] font-mono text-emerald-400">{p.route}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{p.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-500 text-center py-6">Specification not yet finalized.</div>
                  )}
                </div>
              ) : (
                /* TRANSCRIPT */
                <div className="space-y-3">
                  {project.rawTranscript?.length === 0 ? (
                    <div className="text-slate-500 text-center py-6">No transcript recorded for this call.</div>
                  ) : (
                    project.rawTranscript?.map((t, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          t.speaker === 'user'
                            ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100'
                            : 'bg-slate-900 border border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="font-bold uppercase tracking-wider">
                            {t.speaker === 'user' ? 'Caller' : 'AI Consultant'}
                          </span>
                          <span>{t.timestamp}</span>
                        </div>
                        <div>{t.text}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Live Device Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl bg-[#0b0f19] border border-slate-800/80 overflow-hidden">
            {/* Preview Toolbar */}
            <div className="p-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline-block">
                  {liveUrl}
                </span>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Refresh Preview"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={copyLiveUrl}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Preview Iframe Container */}
            <div className="flex-1 bg-[#06080e] p-4 flex items-center justify-center overflow-auto min-h-[580px]">
              <div
                className={`h-full min-h-[550px] transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#070a12] ${
                  viewport === 'desktop'
                    ? 'w-full'
                    : viewport === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                {project.status === 'DEPLOYED' ? (
                  <iframe
                    key={iframeKey}
                    src={liveUrl}
                    title="Website Preview"
                    className="w-full h-full min-h-[550px] border-0"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                  />
                ) : (
                  <div className="w-full h-full min-h-[550px] flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                      <Terminal className="w-7 h-7 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">Autonomous Assembly in Progress</h3>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {project.currentStepMessage}
                      </p>
                    </div>
                    <div className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                      Stage: {project.status} ({project.progressPercent}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
