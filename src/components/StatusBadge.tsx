import React from 'react';
import { ProjectStatus } from '@/types';

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const configs: Record<ProjectStatus, { bg: string; text: string; border: string; label: string; pulse?: boolean }> = {
    IDLE: { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700', label: 'Idle' },
    CALL_CONNECTED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Call Connected', pulse: true },
    CALL_IN_PROGRESS: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', label: 'In Call', pulse: true },
    CALL_COMPLETED: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', label: 'Call Ended' },
    TRANSCRIPT_PROCESSING: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Analyzing Spec', pulse: true },
    SPECIFICATION_READY: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', label: 'Spec Ready' },
    BUILDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Scaffolding Code', pulse: true },
    TESTING: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Testing & Verification', pulse: true },
    DEPLOYING: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Deploying Vercel', pulse: true },
    DEPLOYED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Production Live' },
    FAILED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Build Failed' },
  };

  const c = configs[status] || configs.IDLE;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {c.pulse && <span className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text-', 'bg-')} animate-pulse`} />}
      {c.label}
    </span>
  );
}
