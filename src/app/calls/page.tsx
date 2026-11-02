'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import {
  PhoneCall,
  Clock,
  Radio,
  Globe,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCw,
} from 'lucide-react';
import { CallRecord } from '@/types';

export default function CallsPage() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCalls = async () => {
    try {
      const res = await fetch('/api/calls');
      if (res.ok) {
        const data = await res.json();
        setCalls(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCallId(expandedCallId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sarvam Voice Agents & Telephony Logs</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Call History & Transcripts</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Review caller recordings, verbatim multilingual speech transcripts, and post-call autonomous build events.
            </p>
          </div>

          <Link
            href="/phone"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Make New Call</span>
          </Link>
        </div>

        {calls.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0b0f19] border border-slate-800/80 text-center space-y-3">
            <Radio className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No call records found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Inbound phone calls and Voice Studio sessions will automatically be logged here with complete transcripts.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {calls.map((c) => {
              const isExpanded = expandedCallId === c.id;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl bg-[#0b0f19] border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all"
                >
                  <div
                    onClick={() => toggleExpand(c.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{c.callerNumber}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {c.provider}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>{new Date(c.startedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Duration: {c.durationSeconds}s</span>
                          <span>•</span>
                          <span className="text-indigo-400">{c.transcript?.length || 0} dialogue turns</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
                        <span>{isExpanded ? 'Hide Transcript' : 'View Transcript'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Transcript Drawer */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Verbatim Audio Transcript (Sarvam Saaras v3)
                      </span>
                      <div className="space-y-2">
                        {c.transcript?.map((t, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl text-xs ${
                              t.speaker === 'user'
                                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 ml-6'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 mr-6'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span className="font-bold uppercase tracking-wider">
                                {t.speaker === 'user' ? 'Caller' : 'AI Architect (Aditya)'}
                              </span>
                              <span>{t.timestamp}</span>
                            </div>
                            <div>{t.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
