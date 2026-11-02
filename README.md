# VoxBuild AI — Autonomous Voice-to-Website Builder

> An autonomous software development agent that creates, verifies, and deploys complete production web applications entirely from voice conversations using **Sarvam AI**, **GitHub**, and **Vercel**.

[![Sarvam AI](https://img.shields.io/badge/Voice%20AI-Sarvam%20AI-orange)](https://sarvam.ai)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015%20App%20Router-black)](https://nextjs.org)
[![Vercel Deployed](https://img.shields.io/badge/Deployment-Vercel%20Edge-black)](https://vercel.com)
[![GitHub](https://img.shields.io/badge/VCS-GitHub%20API-blue)](https://github.com/harshvshah12)

---

## 💡 The Core Workflow

**CALL → DESCRIBE → HANG UP → AI BUILDS → DEPLOYED TO VERCEL**

1. **In-Browser Simulated Calling Agent**: You visit the VoxBuild AI website and click **"Call AI Agent"**. No expensive rented phone numbers, Exotel, or Twilio contracts required.
2. **Natural Spoken Conversation**: The AI consultant greets you and asks what website you want to build. You describe your requirements naturally in **English, Hindi (हिंदी), Marathi (मराठी), or Hinglish**.
3. **Sarvam Multimodal Voice Engine**:
   - **Speech-to-Text (Saaras:v3)**: Accurately transcribes spoken Indian languages and accents.
   - **Reasoning & Dialogue (Sarvam-105B / Conversations)**: Understands feature requirements, design aesthetics, databases, and auth workflows.
   - **Neural Voice Synthesis (Bulbul:v3)**: Speaks human-like audio back to your speaker in real-time.
4. **Hang Up Trigger**: When you hang up, the system automatically detects call termination.
5. **Specification Extraction**: Converts the voice transcript into a structured architectural JSON specification.
6. **Autonomous Code Scaffolding**: An isolated workspace is initialized (`workspaces/<project-id>`). The agent writes components, styles, interactive pages, and database schemas.
7. **Automated Verification**: Runs compilation, syntax, and TypeScript verification checks with a self-healing retry loop.
8. **Autonomous GitHub Push**: Creates a repository under your GitHub account (`harshvshah12/<project-slug>`) and commits the source code.
9. **Instant Vercel Production Deployment**: Deploys the application directly to Vercel edge production and returns the live URL (`https://<project-slug>.vercel.app`).
10. **Notification**: Dispatches deployment alerts via WhatsApp and the in-app Dashboard.

---

## 🚀 Live Demo Verification

- **Generated Hotel Platform Live on Vercel**: [https://luxestay-hotel-bookings-axd87xx1e-harshvshah12s-projects.vercel.app](https://luxestay-hotel-bookings-axd87xx1e-harshvshah12s-projects.vercel.app)
- **GitHub Repository**: [https://github.com/harshvshah12/luxestay-hotel-bookings](https://github.com/harshvshah12/luxestay-hotel-bookings)

---

## 🛠️ Tech Stack & Architecture

- **Frontend & App Shell**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Voice AI Provider**: Sarvam AI (`bulbul:v3` TTS, `saaras:v3` STT, `sarvam-105b-conversations` LLM)
- **Autonomous Coding Engine**: Multi-agent task planning, AST/file scaffolding, automated compilation & verification
- **Deployment Platform**: Vercel CLI & REST API v13
- **Source Control**: GitHub REST API
- **State & Queue Management**: Durable JSON & SQLite file store with real-time SSE telemetry
- **Notifications**: WhatsApp Business API / Webhooks & Dashboard Notification Center

---

## 📁 Project Structure

\`\`\`
x:\Sarvam/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main Dashboard (KPIs, active jobs, instant demos)
│   │   ├── phone/page.tsx         # In-Browser Calling Agent Simulator (Mic, TTS, Waveform)
│   │   ├── calls/page.tsx         # Voice Call History & Verbatim Transcripts
│   │   ├── projects/page.tsx      # Generated Websites Portfolio
│   │   ├── projects/[id]/page.tsx # Project Workspace (Spec, Logs, Live Device Preview)
│   │   ├── settings/page.tsx      # Sarvam, GitHub & Vercel Configuration Hub
│   │   ├── layout.tsx             # Root layout with Dark Obsidian theme
│   │   └── api/
│   │       ├── voice/chat         # Sarvam LLM dialogue & Bulbul TTS
│   │       ├── voice/transcribe   # Sarvam Saaras STT
│   │       ├── voice/synthesize   # Sarvam Bulbul TTS
│   │       ├── webhooks/call-ended# Post-call autonomous trigger
│   │       ├── pipeline/[id]/logs # Real-time build logs stream
│   │       ├── pipeline/[id]/retry# Self-healing retry trigger
│   │       ├── projects           # Projects CRUD
│   │       ├── calls              # Calls CRUD
│   │       └── settings           # Runtime settings
│   ├── lib/
│   │   ├── sarvam.ts              # Sarvam AI REST API client
│   │   ├── specExtractor.ts       # Voice-to-JSON Architecture extractor
│   │   ├── engine/
│   │   │   ├── scaffolder.ts      # Next.js 15 multi-page application generator
│   │   │   └── orchestrator.ts    # Pipeline runner (Spec -> Scaffold -> Test -> Deploy)
│   │   ├── github.ts              # GitHub repo creation & git push
│   │   ├── vercel.ts              # Vercel production deployment runner
│   │   ├── notifications.ts       # WhatsApp & in-app alerts
│   │   └── store.ts               # Durable persistence
│   └── types/index.ts             # TypeScript schemas
├── workspaces/                    # Isolated execution sandboxes for generated sites
└── .env                           # Environment secrets
\`\`\`

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- Node.js v20+ or v22+
- npm v10+
- Git

### 2. Installation
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the root directory:
\`\`\`env
# Sarvam AI Credentials
SARVAM_API_KEY=sk_5ko0fscu_BqdWSSdsNSljLK8HtvoO6lMG
SARVAM_VOICE_MODEL=bulbul:v3
SARVAM_STT_MODEL=saaras:v3
SARVAM_LLM_MODEL=sarvam-105b-conversations
SARVAM_SPEAKER=aditya
SARVAM_LANGUAGE_CODE=en-IN

# Deployment Credentials
GITHUB_TOKEN=your_github_pat_here
GITHUB_USERNAME=harshvshah12
VERCEL_TOKEN=your_vercel_token_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=3000
\`\`\`

### 4. Running the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📞 How to Use the In-Browser Calling Agent

1. Click **"Call AI Agent"** in the top navigation or navigate to \`/phone\`.
2. Select your preferred language: **English**, **हिंदी (Hindi)**, or **मराठी (Marathi)**.
3. Click **"Call AI Agent Now"**.
4. The AI consultant (Aditya) will speak: *"Hello! Welcome to VoxBuild AI. What kind of website would you like me to build today?"*
5. Click the **Microphone** icon to speak your requirements (or type in the text bar or click quick prompts).
6. When done, click **"Hang Up & Build Website"**.
7. The platform automatically redirects you to the live Project Workspace where you can watch:
   - Specification extraction
   - Source code scaffolding
   - Automated testing
   - GitHub repository creation
   - Vercel production deployment
   - Live interactive device preview!
