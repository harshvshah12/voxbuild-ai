import { ProjectSpecification } from '@/types';

export function getAgencyNavbar(spec: ProjectSpecification): string {
  return `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Award, Compass, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090b10]/90 border-b border-amber-950/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-amber-300 transition-colors">
              ${spec.projectName}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            Works
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Case Studies
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-orange-400" />
            Client Portal
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-orange-600/30 active:scale-95 transition-all"
          >
            <span>Start A Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-950 bg-[#090b10] px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Works
          </Link>
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Case Studies
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Client Portal
          </Link>
        </div>
      )}
    </header>
  );
}
`;
}

export function getAgencyFooter(spec: ProjectSpecification): string {
  return `import React from 'react';
import Link from 'next/link';
import { Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-950/60 bg-[#05070d] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white text-base">${spec.projectName}</span>
          </div>
          <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
            ${spec.description}
          </p>
          <div className="text-xs text-slate-500 pt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Honored with 12x Awwwards SOTD & Red Dot Design Awards</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Studio</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Featured Works</Link></li>
            <li><Link href="/explore" className="hover:text-white transition-colors">Case Studies</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Client Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Discipline</h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>Design Engineering & Spatial UI</li>
            <li>WebGL 3D & Micro-Interactions</li>
            <li>Autonomous AI Web Architecture</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-950/50 max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© {new Date().getFullYear()} ${spec.projectName}. Swiss Editorial Digital Studio.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-amber-400 inline fill-amber-400" /> by VoxBuild AI
        </p>
      </div>
    </footer>
  );
}
`;
}

export function getAgencyHomePage(spec: ProjectSpecification): string {
  return `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Award,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Zap,
  Globe,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  impact: string;
  image: string;
  description: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Chronos Spatial Brand & Intelligence',
    client: 'Chronos Labs',
    category: 'AI Systems',
    year: '2026',
    impact: '+340% Conversions',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Autonomous spatial computing interface and comprehensive design token architecture.'
  },
  {
    id: '2',
    title: 'Vanguard Global Fintech Platform',
    client: 'Vanguard Capital',
    category: 'Digital Products',
    year: '2026',
    impact: '$18M Series A Secured',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description: 'Sub-millisecond institutional trading dashboard with dark obsidian Swiss typography.'
  },
  {
    id: '3',
    title: 'Komorebi Architectural Brand & 3D WebGL',
    client: 'Komorebi Studio',
    category: '3D & WebGL',
    year: '2025',
    impact: 'Awwwards Site of the Year',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Interactive canvas ray-marching experience presenting ultra-luxury contemporary residences.'
  },
  {
    id: '4',
    title: 'Helios Autonomous Robotics System',
    client: 'Helios Dynamics',
    category: 'Design Engineering',
    year: '2025',
    impact: '100k+ Pre-orders',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description: 'Hardware companion mobile application and gesture-controlled spatial control cockpit.'
  }
];

export default function HomePage() {
  const [category, setCategory] = useState('All');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const categories = ['All', 'Digital Products', 'AI Systems', '3D & WebGL', 'Design Engineering'];

  const filtered = CASE_STUDIES.filter((c) => category === 'All' || c.category === category);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryModalOpen(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-amber-950/40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[250px] bg-orange-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-800/40 text-xs font-semibold text-amber-300 mb-6 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>${spec.tagline}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Crafting Unforgettable Digital Artifacts with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400">
              ${spec.projectName}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ${spec.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 active:scale-95 transition-all"
            >
              <span>Initiate Project Inquiry</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-950 text-slate-200 hover:text-white font-semibold text-sm transition-all"
            >
              <span>Explore All Case Studies</span>
            </Link>
          </div>

          {/* Honors Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-white">12x</div>
              <div className="text-xs text-slate-400 mt-0.5">Awwwards SOTD</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-amber-400">$84M+</div>
              <div className="text-xs text-slate-400 mt-0.5">Client Venture Capital Raised</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-orange-400">&lt; 14 Days</div>
              <div className="text-xs text-slate-400 mt-0.5">Rapid MVP Delivery Cycle</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Production Code Handover</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Bento Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Selected Works & Case Studies
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              A curated selection of venture-backed software and transformative brands.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={\`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all \${
                  category === c
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }\`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#0c0f17] border border-amber-950/50 overflow-hidden hover:border-amber-500/40 transition-all flex flex-col"
            >
              <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {item.category}
                </span>
                <span className="absolute bottom-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-300">
                  {item.impact}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Client: {item.client}</span>
                    <span>Year: {item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-semibold">View Case Study</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-amber-600 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b0e16] border border-amber-950 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Proposal Request Received</h3>
                <p className="text-xs text-slate-400">
                  Our principal partner will review your requirements and respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Partnership</span>
                  <h3 className="text-lg font-bold text-white mt-1">Request Studio Proposal</h3>
                  <p className="text-xs text-slate-400">Tell us about your venture and timeline goals.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Company / Project Name</label>
                    <input
                      required
                      type="text"
                      defaultValue="Aura Labs"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Contact Email</label>
                    <input
                      required
                      type="email"
                      defaultValue="harsh@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Estimated Budget Bracket</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500">
                      <option>₹10,00,000 – ₹25,00,000 (Venture MVP)</option>
                      <option>₹25,00,000 – ₹50,00,000 (Full Brand & Product)</option>
                      <option>₹50,00,000+ (Enterprise Scale)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/30"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
`;
}

export function getAgencyExplorePage(spec: ProjectSpecification): string {
  return `'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, Compass } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="border-b border-amber-950 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Case Studies & Teardowns</h1>
          <p className="text-slate-400 text-sm mt-1">
            Deep dive into technical architectures, design tokens, and business growth metrics.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-amber-950/60 text-center py-16 space-y-3">
          <Award className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Full Archive Available</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Explore 14 award-winning digital projects delivered with Next.js 15, WebGL, and autonomous engineering.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
`;
}

export function getAgencyDashboardPage(spec: ProjectSpecification): string {
  return `'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, CheckCircle2, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-950 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Client Delivery Portal</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Active Deliverables & Sprint Roadmap</h1>
            <p className="text-slate-400 text-sm mt-0.5">Review Figma prototypes, staging deployments, and milestone sign-offs.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Client: <strong className="text-white">Harsh Shah</strong>
            </span>
          </div>
        </div>

        {/* Milestone Tracker Card */}
        <div className="rounded-2xl bg-[#0c0f17] border border-amber-950/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Sprint 03 / Production Release</span>
              <h3 className="text-base font-bold text-white mt-0.5">Autonomous Edge Deployment Handover</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold self-start sm:self-auto">
              Ready for Review
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Deliverable</span>
              <span className="text-slate-200 font-medium">Next.js 15 App Router Edge Build</span>
            </div>
            <div>
              <span className="text-slate-500 block">Milestone Status</span>
              <span className="text-emerald-400 font-bold">100% Verified Live</span>
            </div>
            <div>
              <span className="text-slate-500 block">Hosting Target</span>
              <span className="text-white font-bold">Vercel Global Edge</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
`;
}
