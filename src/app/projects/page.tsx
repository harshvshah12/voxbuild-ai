'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Globe,
  GitBranch,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import { ProjectRecord } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 3500);
    return () => clearInterval(interval);
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specification?.projectType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Vercel Edge & GitHub Auto-Push Pipeline</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Generated Websites Portfolio</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Production web applications created autonomously by the VoxBuild AI coding agent.
            </p>
          </div>

          <Link
            href="/phone"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Website</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 p-2 bg-[#0b0f19] border border-slate-800/80 rounded-2xl max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search by name, industry or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0b0f19] border border-slate-800/80 text-center space-y-3">
            <Globe className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No websites match your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Call the AI consultant or trigger a simulation to generate websites.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl bg-[#0b0f19] border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {proj.specification?.projectType || 'Full-Stack App'}
                    </span>
                    <StatusBadge status={proj.status} />
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{proj.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {proj.specification?.description || 'Autonomous website crafted from phone dialogue.'}
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
                  <div className="flex items-center gap-3">
                    {proj.vercelDeploymentUrl && (
                      <a
                        href={proj.vercelDeploymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <span>Live Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.githubRepoUrl && (
                      <a
                        href={proj.githubRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/projects/${proj.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
