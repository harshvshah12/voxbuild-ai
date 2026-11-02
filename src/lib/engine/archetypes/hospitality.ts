import { ProjectSpecification } from '@/types';

export function getHospitalityNavbar(spec: ProjectSpecification): string {
  return `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, ArrowRight, LayoutDashboard, Compass } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              ${spec.projectName}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            Explore Stays
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            Guest Hub
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-95 transition-all"
          >
            <span>Book A Stay</span>
            <ArrowRight className="w-4 h-4" />
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
        <div className="md:hidden border-b border-slate-800 bg-[#090d16] px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Overview
          </Link>
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Explore Stays
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Guest Hub
          </Link>
        </div>
      )}
    </header>
  );
}
`;
}

export function getHospitalityFooter(spec: ProjectSpecification): string {
  return `import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#060810] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-base">${spec.projectName}</span>
          </div>
          <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
            ${spec.description}
          </p>
          <div className="text-xs text-slate-500 pt-2">
            Generated autonomously from voice conversation via VoxBuild AI.
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Architecture</h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>Framework: Next.js 15 App Router</li>
            <li>Styling: Tailwind CSS (${spec.design.style})</li>
            <li>Database: ${spec.backend.databaseType || 'Supabase'} Ready</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/60 max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© {new Date().getFullYear()} ${spec.projectName}. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> by VoxBuild AI
        </p>
      </div>
    </footer>
  );
}
`;
}

export function getHospitalityHomePage(spec: ProjectSpecification): string {
  return `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Sparkles,
  CheckCircle2,
  Star,
  Search,
  ShieldCheck,
  Zap,
  Globe,
  ChevronRight,
  MapPin,
  X
} from 'lucide-react';

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  price: string;
  location: string;
  image: string;
  badge: string;
  description: string;
}

const ITEMS: ShowcaseItem[] = [
  {
    id: '1',
    title: 'Aura Grand Horizon Villa',
    category: 'Premium Suites',
    rating: 4.95,
    price: '₹14,999 / night',
    location: 'North Goa / Sea Facing',
    badge: 'Popular Choice',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Private infinity pool overlooking the Arabian Sea, full-service butler and private sun terrace.'
  },
  {
    id: '2',
    title: 'Celestia Mountain Chalet',
    category: 'Nature Escapes',
    rating: 4.98,
    price: '₹18,500 / night',
    location: 'Manali, Himachal Pradesh',
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description: 'Heated wooden lodge with panoramic Himalayan view, fireplace and local organic dining.'
  },
  {
    id: '3',
    title: 'Obsidian Sky Penthouse',
    category: 'Urban Luxury',
    rating: 4.91,
    price: '₹22,000 / night',
    location: 'Bandra West, Mumbai',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    description: '360-degree skyline views with smart home automation, private wine cellar and rooftop spa.'
  },
  {
    id: '4',
    title: 'The Royal Heritage Haveli',
    category: 'Cultural Retreats',
    rating: 4.88,
    price: '₹12,499 / night',
    location: 'Udaipur, Rajasthan',
    badge: 'Cultural Gem',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    description: 'Centuries-old restored lakeside palace with traditional jharokhas and evening cultural performances.'
  }
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModalItem, setBookingModalItem] = useState<ShowcaseItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const categories = ['All', 'Premium Suites', 'Nature Escapes', 'Urban Luxury', 'Cultural Retreats'];

  const filteredItems = ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBook = (item: ShowcaseItem) => {
    setBookingModalItem(item);
    setBookingConfirmed(false);
  };

  const confirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingModalItem(null);
      setBookingConfirmed(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>${spec.tagline}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Experience The Next Era of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400">
              ${spec.projectName}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ${spec.description}
          </p>

          <div className="mt-10 max-w-2xl mx-auto p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-3.5 py-2">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, location or amenity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-white">4.96 ★</div>
              <div className="text-xs text-slate-400 mt-0.5">Average Guest Rating</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified Listings</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-indigo-400">&lt; 30s</div>
              <div className="text-xs text-slate-400 mt-0.5">Instant Confirmation</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-400 mt-0.5">Dedicated Concierge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Collections & Highlights
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Handcrafted destinations designed for discerning travelers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={\`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all \${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#0d121f] border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-xs font-bold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {item.rating}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Rate</span>
                    <span className="text-sm font-bold text-white">{item.price}</span>
                  </div>
                  <button
                    onClick={() => handleBook(item)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid: Built-in Capabilities */}
      <section className="py-16 bg-[#060810] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Architectural Highlights & Capabilities
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Every detail engineered autonomously to meet the voice specification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0b0f1a] border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant Reactive Filtering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Client-side state synchronization with zero delay across categories, search terms, and pricing brackets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f1a] border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Supabase PostgreSQL Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pre-configured database schemas and authentication hooks ready for immediate production cloud connection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f1a] border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Edge Accelerated</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed directly on Vercel Global Edge Network with sub-millisecond TTFB and automated TLS encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Dialog Modal */}
      {bookingModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1322] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setBookingModalItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Reservation Confirmed!</h3>
                <p className="text-xs text-slate-400">
                  We have saved your stay at <span className="text-white font-semibold">{bookingModalItem.title}</span>. A confirmation has been logged to your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={confirmReservation} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Fast Booking</span>
                  <h3 className="text-lg font-bold text-white">{bookingModalItem.title}</h3>
                  <p className="text-xs text-slate-400">{bookingModalItem.location} • {bookingModalItem.price}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Your Full Name</label>
                    <input
                      required
                      type="text"
                      defaultValue="Harsh Shah"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Contact Phone</label>
                    <input
                      required
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Check-in Date</label>
                      <input
                        type="date"
                        defaultValue="2026-11-15"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Guests</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500">
                        <option>2 Adults</option>
                        <option>1 Adult</option>
                        <option>4 Adults (Family)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalItem(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                  >
                    Confirm & Pay at Property
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

export function getHospitalityExplorePage(spec: ProjectSpecification): string {
  return `'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SlidersHorizontal } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a12]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Explore Curated Luxury Stays</h1>
          <p className="text-slate-400 text-sm mt-1">Discover handcrafted accommodations with real-time availability and amenities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                Filter Stays
              </h3>
              
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-indigo-600 focus:ring-0" />
                  <span>Sea Facing / Beachfront</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 text-indigo-600 focus:ring-0" />
                  <span>Private Swimming Pool</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 text-indigo-600 focus:ring-0" />
                  <span>Pet Friendly Lodges</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 text-indigo-600 focus:ring-0" />
                  <span>Complimentary Breakfast</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <label className="text-xs text-slate-400 block mb-2 font-medium">Price Range</label>
                <input type="range" min="5000" max="40000" defaultValue="20000" className="w-full accent-indigo-500" />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹5,000</span>
                  <span>₹40,000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing <strong className="text-white">4 verified properties</strong></span>
              <span>Sorted by <strong className="text-indigo-400">Guest Ratings (High to Low)</strong></span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800/80 flex flex-col sm:flex-row gap-5 hover:border-slate-700 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                  alt="Aura Grand Horizon Villa"
                  className="w-full sm:w-56 h-40 object-cover rounded-xl"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Sea Facing</span>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">★ 4.95 (148 reviews)</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">Aura Grand Horizon Villa</h3>
                    <p className="text-xs text-slate-400 mt-1">Private infinity pool, sea view deck, master jacuzzi, customized dining.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-sm font-bold text-white">₹14,999 <span className="text-xs font-normal text-slate-500">/ night</span></span>
                    <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">Reserve</button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800/80 flex flex-col sm:flex-row gap-5 hover:border-slate-700 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
                  alt="Celestia Mountain Chalet"
                  className="w-full sm:w-56 h-40 object-cover rounded-xl"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Himalayan View</span>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">★ 4.98 (210 reviews)</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">Celestia Mountain Chalet</h3>
                    <p className="text-xs text-slate-400 mt-1">Cedar wood heated cabin, stone fireplace, snow peaks view and private stargazing dome.</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-sm font-bold text-white">₹18,500 <span className="text-xs font-normal text-slate-500">/ night</span></span>
                    <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">Reserve</button>
                  </div>
                </div>
              </div>
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

export function getHospitalityDashboardPage(spec: ProjectSpecification): string {
  return `'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a12]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Customer Account Active</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Guest Portal & Booking Hub</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage your upcoming stays, receipts, and profile preferences.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Logged in as <strong className="text-white">Harsh Shah</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Confirmed Stays</span>
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">1 Active</div>
            <div className="text-[11px] text-emerald-400 mt-1">Check-in on Nov 15, 2026</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Travel Spend</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">₹14,999</div>
            <div className="text-[11px] text-slate-400 mt-1">Pay at property confirmed</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Membership Tier</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 mt-2">Gold Founder</div>
            <div className="text-[11px] text-slate-400 mt-1">15% discount on dining & spa</div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0b0f19] border border-slate-800/80 overflow-hidden">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Your Itinerary & Bookings</h3>
            <span className="text-xs text-slate-400">Order ID #VX-2026-9041</span>
          </div>
          <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Aura Grand Horizon Villa (Goa)</h4>
                <p className="text-xs text-slate-400">Nov 15, 2026 – Nov 18, 2026 • 2 Guests • Sea Facing Suite</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Confirmed
              </span>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium">
                View Voucher
              </button>
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
