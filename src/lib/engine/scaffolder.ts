import fs from 'fs';
import path from 'path';
import { ProjectSpecification } from '@/types';
import { detectArchetype, getArchetypeGenerator } from './archetypes';

export class CodeScaffolder {
  /**
   * Generate complete, modern source code in an isolated workspace
   */
  async scaffoldProject(workspacePath: string, spec: ProjectSpecification): Promise<string[]> {
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true });
    }

    const createdFiles: string[] = [];

    // Helper to write files with strict forward slashes for Linux & Vercel
    const writeFile = (relativePath: string, content: string) => {
      const fullPath = path.join(workspacePath, relativePath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, content.trim() + '\n', 'utf-8');
      createdFiles.push(relativePath.replace(/\\/g, '/'));
    };

    // 1. package.json
    writeFile('package.json', JSON.stringify({
      name: spec.slug,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: '^15.1.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        'lucide-react': '^1.16.0',
        clsx: '^2.1.1',
        'tailwind-merge': '^3.0.0'
      },
      devDependencies: {
        typescript: '^5.7.0',
        '@types/node': '^22.10.0',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        postcss: '^8.4.49',
        tailwindcss: '^3.4.17',
        autoprefixer: '^10.4.20'
      }
    }, null, 2));

    // 2. tsconfig.json
    writeFile('tsconfig.json', JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./src/*'] }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2));

    // 3. postcss.config.js
    writeFile('postcss.config.js', `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);

    // 4. tailwind.config.js
    const isDark = spec.design.theme.includes('dark') || spec.design.theme.includes('obsidian') || true;
    writeFile('tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "${spec.design.primaryColor || '#6366f1'}",
          accent: "${spec.design.accentColor || '#10b981'}",
          dark: "#0b0f17",
          card: "${isDark ? '#111726' : '#ffffff'}",
          border: "${isDark ? '#1e293b' : '#e2e8f0'}",
        }
      }
    },
  },
  plugins: [],
};
`);

    // 5. next.config.mjs
    writeFile('next.config.mjs', `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com', 'avatar.vercel.sh']
  }
};
export default nextConfig;
`);

    // 6. src/app/globals.css
    writeFile('src/app/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #070a12;
  --foreground: #f8fafc;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #090d16;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
`);

    // 7. src/app/layout.tsx
    writeFile('src/app/layout.tsx', `
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "${spec.projectName} — ${spec.tagline}",
  description: "${spec.description}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
`);

    // Archetype generator dispatch
    const archetype = detectArchetype(spec);
    const generator = getArchetypeGenerator(archetype);

    // 8. Components: Navbar
    writeFile('src/components/Navbar.tsx', generator.getNavbar(spec));

    // 9. Components: Footer
    writeFile('src/components/Footer.tsx', generator.getFooter(spec));

    // 10. src/app/page.tsx
    writeFile('src/app/page.tsx', generator.getHomePage(spec));

    // 11. src/app/explore/page.tsx
    writeFile('src/app/explore/page.tsx', generator.getExplorePage(spec));

    // 12. src/app/dashboard/page.tsx
    writeFile('src/app/dashboard/page.tsx', generator.getDashboardPage(spec));

    // 13. src/app/api/data/route.ts
    writeFile('src/app/api/data/route.ts', `
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    project: "${spec.projectName}",
    archetype: "${archetype}",
    features: ${JSON.stringify(spec.features)},
    generatedAt: new Date().toISOString()
  });
}
`);

    // 14. README.md
    writeFile('README.md', `
# ${spec.projectName}

> ${spec.tagline}

Built autonomously from voice requirements using **[VoxBuild AI](https://voxbuild.ai)**.

## Architecture
- **Framework**: Next.js 15 (App Router) & React 19
- **Archetype**: ${archetype.toUpperCase()}
- **Styling**: Tailwind CSS (${spec.design.style})
- **Backend**: Ready for Supabase PostgreSQL
- **Deployed on**: Vercel Global Edge Network

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
`);

    return createdFiles;
  }
}

export const codeScaffolder = new CodeScaffolder();
