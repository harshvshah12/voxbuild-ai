import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VoxBuild AI — Autonomous Voice-to-Website Builder',
  description: 'AI software development agent that builds and deploys production websites from natural voice conversations using Sarvam AI.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
