import { ProjectSpecification, TranscriptMessage } from '@/types';
import { sarvam } from './sarvam';

export class SpecExtractor {
  /**
   * Extract comprehensive project specifications from raw voice transcripts
   */
  async extractSpecification(
    transcript: TranscriptMessage[],
    fallbackName = 'Untitled Project'
  ): Promise<ProjectSpecification> {
    const formattedTranscript = transcript
      .map((t) => `${t.speaker.toUpperCase()} [${t.timestamp || ''}]: ${t.text}`)
      .join('\n');

    const systemPrompt = `You are a Principal Software Architect and Voice-to-Code Engineering Agent for VoxBuild AI.
Your task is to analyze conversational transcripts from phone calls where users describe their desired website or web application.
The user may speak in English, Hindi, Marathi, or Hinglish.
Analyze their requirements, detect their intent, and produce a complete, production-grade JSON specification.

CRITICAL INSTRUCTIONS:
1. Extract ALL explicit requirements (colors, dark mode, features, auth, database, pages, admin panel).
2. If certain technical details are not explicitly mentioned, apply SENSIBLE, MODERN, PRODUCTION-GRADE DEFAULTS (e.g. Next.js 15, Tailwind CSS, Dark Obsidian theme, Supabase compatibility, responsive layout).
3. Do not leave fields empty or generic. Craft specific, high-value feature lists and component architectures.
4. Output ONLY valid JSON matching the exact schema below, with no markdown backticks, explanations, or commentary.

SCHEMA:
{
  "projectName": "Name of the website",
  "slug": "url-friendly-lowercase-slug",
  "tagline": "Punchy one-sentence value proposition",
  "description": "Comprehensive description of the application",
  "projectType": "Full-stack web application | SaaS Dashboard | E-commerce Store | Booking Platform | Portfolio",
  "targetAudience": "Target user personas",
  "design": {
    "theme": "dark" | "light" | "midnight-obsidian" | "luxury-gold" | "cyberpunk" | "clean-white",
    "primaryColor": "#hexcode",
    "accentColor": "#hexcode",
    "style": "Swiss Editorial Bento | Glassmorphism | Dark Obsidian Luxe | Apple Minimalist",
    "typography": "Inter / Geist Sans",
    "animations": true,
    "responsive": true
  },
  "features": [
    "Feature 1 with clear action",
    "Feature 2 with clear action",
    "Feature 3 with clear action",
    "Feature 4 with clear action",
    "Feature 5 with clear action"
  ],
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "description": "Hero section, featured items, value pillars, CTA",
      "sections": ["Hero", "Features Grid", "Live Demo/Filter", "Testimonials", "Footer"]
    },
    {
      "name": "Explore / Listings",
      "route": "/explore",
      "description": "Interactive search, filter chips, item cards with modal preview",
      "sections": ["Search Header", "Category Filters", "Results Grid", "Pagination"]
    },
    {
      "name": "Dashboard",
      "route": "/dashboard",
      "description": "User overview, analytics KPI cards, recent activity",
      "sections": ["KPI Stats", "Activity Feed", "Action Bar"]
    }
  ],
  "components": [
    { "name": "Navbar", "purpose": "Sticky glassmorphic top navigation with responsive mobile drawer" },
    { "name": "HeroSection", "purpose": "High-impact headline, dynamic badge, CTA buttons" },
    { "name": "ItemCard", "purpose": "Interactive card with badge, rating, pricing, and modal trigger" },
    { "name": "FilterBar", "purpose": "Dynamic category and search input filtering" }
  ],
  "backend": {
    "needsDatabase": true,
    "databaseType": "supabase",
    "needsAuth": true,
    "authProvider": "supabase",
    "hasAdminDashboard": true,
    "apiEndpoints": ["/api/items", "/api/bookings", "/api/auth"]
  },
  "mockDataRequirements": [
    "Sample items with titles, images, prices, tags",
    "Mock user profiles and sample analytics stats"
  ],
  "deploymentRequested": true
}`;

    try {
      // Use Sarvam LLM for conversation understanding
      const response = await sarvam.chatCompletion(
        [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Here is the voice phone conversation transcript:\n\n${formattedTranscript}\n\nPlease generate the complete JSON specification now.`,
          },
        ],
        {
          model: 'sarvam-105b-conversations',
          temperature: 0.2,
          maxTokens: 2500,
        }
      );

      let rawContent = response.content.trim();
      // Clean possible markdown code fences
      if (rawContent.startsWith('```')) {
        rawContent = rawContent.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
      }

      const parsed: ProjectSpecification = JSON.parse(rawContent);
      return this.sanitizeSpecification(parsed, fallbackName);
    } catch (err: any) {
      console.warn('[SpecExtractor] LLM extraction error or JSON parse issue. Falling back to structured heuristic extractor:', err.message);
      return this.generateHeuristicFallback(transcript, fallbackName);
    }
  }

  private sanitizeSpecification(spec: Partial<ProjectSpecification>, fallbackName: string): ProjectSpecification {
    const projectName = spec.projectName?.trim() || fallbackName;
    const slug = (spec.slug || projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

    return {
      projectName,
      slug: slug || 'voxbuild-project',
      tagline: spec.tagline || 'Crafted autonomously from voice via VoxBuild AI',
      description: spec.description || `Autonomous web application generated from voice conversation requirements.`,
      projectType: spec.projectType || 'Full-stack web application',
      targetAudience: spec.targetAudience || 'Modern web users',
      design: {
        theme: spec.design?.theme || 'midnight-obsidian',
        primaryColor: spec.design?.primaryColor || '#6366f1',
        accentColor: spec.design?.accentColor || '#10b981',
        style: spec.design?.style || 'Dark Obsidian Luxe & Bento Grid',
        typography: spec.design?.typography || 'Inter / Geist',
        animations: spec.design?.animations ?? true,
        responsive: spec.design?.responsive ?? true,
      },
      features: spec.features && spec.features.length > 0 ? spec.features : [
        'Interactive real-time filtering and search',
        'Responsive mobile and desktop navigation',
        'Dynamic booking / inquiry workflow',
        'Glassmorphic analytics overview card',
        'Integrated authentication and profile state',
      ],
      pages: spec.pages && spec.pages.length > 0 ? spec.pages : [
        {
          name: 'Home',
          route: '/',
          description: 'Landing page with hero, features, and showcase',
          sections: ['Hero', 'Feature Showcase', 'Interactive Preview', 'Call to Action'],
        },
        {
          name: 'Explore',
          route: '/explore',
          description: 'Browse items with instant search and filter controls',
          sections: ['Search Header', 'Filter Tabs', 'Catalog Grid'],
        },
      ],
      components: spec.components && spec.components.length > 0 ? spec.components : [
        { name: 'Navbar', purpose: 'Glassmorphic top header' },
        { name: 'HeroSection', purpose: 'Headline and call to action' },
        { name: 'FeatureGrid', purpose: 'Responsive bento grid of capabilities' },
      ],
      backend: {
        needsDatabase: spec.backend?.needsDatabase ?? true,
        databaseType: spec.backend?.databaseType || 'supabase',
        needsAuth: spec.backend?.needsAuth ?? true,
        authProvider: spec.backend?.authProvider || 'supabase',
        hasAdminDashboard: spec.backend?.hasAdminDashboard ?? true,
        apiEndpoints: spec.backend?.apiEndpoints || ['/api/items', '/api/data'],
      },
      mockDataRequirements: spec.mockDataRequirements || ['Sample listings', 'User statistics'],
      deploymentRequested: spec.deploymentRequested ?? true,
    };
  }

  private generateHeuristicFallback(transcript: TranscriptMessage[], fallbackName: string): ProjectSpecification {
    const fullText = transcript.map((t) => t.text).join(' ').toLowerCase();

    let name = fallbackName;
    if (fullText.includes('hotel') || fullText.includes('booking')) {
      name = 'LuxeStay Hotel Bookings';
    } else if (fullText.includes('ecommerce') || fullText.includes('store') || fullText.includes('shop')) {
      name = 'Aura Commerce Hub';
    } else if (fullText.includes('portfolio') || fullText.includes('resume')) {
      name = 'Apex Creative Portfolio';
    } else if (fullText.includes('saas') || fullText.includes('dashboard')) {
      name = 'PulseMetrics Analytics';
    }

    const isDark = fullText.includes('dark') || !fullText.includes('light');
    const hasAuth = fullText.includes('auth') || fullText.includes('login') || fullText.includes('user');
    const hasDb = fullText.includes('database') || fullText.includes('supabase') || fullText.includes('data');

    return {
      projectName: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: 'Built autonomously from natural voice dialogue via VoxBuild AI',
      description: `A production-ready web application created from phone transcript requirements.`,
      projectType: 'Full-stack web application',
      targetAudience: 'Global visitors and authenticated customers',
      design: {
        theme: isDark ? 'midnight-obsidian' : 'clean-white',
        primaryColor: '#6366f1',
        accentColor: '#10b981',
        style: 'Dark Obsidian Luxe & Swiss Editorial Bento',
        typography: 'Inter, system-ui',
        animations: true,
        responsive: true,
      },
      features: [
        'Dynamic interactive search and filter system',
        'Responsive navigation with mobile drawer',
        'Real-time booking and confirmation modals',
        'Data persistence ready for Supabase PostgreSQL',
        'Dark/Light aesthetic with smooth earned transitions',
      ],
      pages: [
        {
          name: 'Home',
          route: '/',
          description: 'High-converting hero section, catalog highlights, feature bento grid',
          sections: ['Hero Banner', 'Key Features', 'Top Listings', 'Social Proof', 'Footer'],
        },
        {
          name: 'Explore',
          route: '/explore',
          description: 'Catalog with faceted filters, search, and detail modal preview',
          sections: ['Filter Bar', 'Grid View', 'Detail Drawer'],
        },
        {
          name: 'Dashboard',
          route: '/dashboard',
          description: 'Account overview, recent orders/bookings, and live status',
          sections: ['Overview Stats', 'Active Bookings', 'Account Settings'],
        },
      ],
      components: [
        { name: 'Navbar', purpose: 'Branded header with navigation links and action CTA' },
        { name: 'Hero', purpose: 'Headline, tagline, search input, and background glow' },
        { name: 'CardGrid', purpose: 'Card listing with pricing, badges, and book buttons' },
        { name: 'BookingModal', purpose: 'Interactive dialog for booking confirmation' },
        { name: 'Footer', purpose: 'Links, social icons, and copyright' },
      ],
      backend: {
        needsDatabase: hasDb,
        databaseType: 'supabase',
        needsAuth: hasAuth,
        authProvider: 'supabase',
        hasAdminDashboard: true,
        apiEndpoints: ['/api/listings', '/api/bookings'],
      },
      mockDataRequirements: ['Curated hotel listings', 'User booking records'],
      deploymentRequested: true,
    };
  }
}

export const specExtractor = new SpecExtractor();
