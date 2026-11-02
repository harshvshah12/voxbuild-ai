'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import {
  Mic,
  MicOff,
  PhoneOff,
  PhoneCall,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Loader2,
  Globe,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { TranscriptMessage } from '@/types';

export default function PhonePage() {
  const router = useRouter();
  const [callState, setCallState] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'BUILDING'>('IDLE');
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN' | 'mr-IN'>('en-IN');
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Start Call
  const handleStartCall = async () => {
    setCallState('DIALING');
    setSeconds(0);
    setTranscript([]);

    setTimeout(async () => {
      setCallState('CONNECTED');

      // Initial greeting from AI
      const greetingText =
        language === 'hi-IN'
          ? 'नमस्ते! मैं वॉक्सबिल्ड एआई का वॉइस एजेंट हूँ। आज आप किस प्रकार की वेबसाइट बनाना चाहते हैं?'
          : language === 'mr-IN'
          ? 'नमस्कार! मी वॉक्सबिल्ड एआय चा व्हॉइस एजंट आहे. आज तुम्हाला कोणती वेबसाईट बनवायची आहे?'
          : 'Hello! Welcome to VoxBuild AI. What kind of website would you like me to build today?';

      const initialMessage: TranscriptMessage = {
        speaker: 'ai',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTranscript([initialMessage]);

      // Synthesize greeting audio using Sarvam Bulbul:v3
      try {
        const res = await fetch('/api/voice/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: greetingText,
            languageCode: language,
            speaker: 'aditya',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            playAudio(data.audioBase64);
          }
        }
      } catch (err) {
        console.warn('Greeting audio error:', err);
      }
    }, 1200);
  };

  const playAudio = (base64Audio: string) => {
    if (audioMuted) return;
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audioPlayerRef.current = audio;
      audio.play().catch((e) => console.log('Audio autoplay prevented:', e));
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  // Toggle Microphone recording
  const handleToggleMic = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          stream.getTracks().forEach((track) => track.stop());

          // Send to Sarvam Saaras STT
          setIsAiThinking(true);
          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice.wav');

            const res = await fetch('/api/voice/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (res.ok) {
              const data = await res.json();
              if (data.transcript && data.transcript.trim()) {
                await processUserMessage(data.transcript);
              } else {
                setIsAiThinking(false);
              }
            } else {
              setIsAiThinking(false);
            }
          } catch (err) {
            console.error('Transcription error:', err);
            setIsAiThinking(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert('Microphone access was denied or not available. You can use the quick speech buttons or text input below.');
      }
    }
  };

  // Send message and get AI response
  const processUserMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: TranscriptMessage = {
      speaker: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    const newTranscript = [...transcript, userMsg];
    setTranscript(newTranscript);
    setTextInput('');
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newTranscript,
          userMessage: text,
          languageCode: language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: TranscriptMessage = {
          speaker: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString(),
        };
        setTranscript([...newTranscript, aiMsg]);

        if (data.audioBase64) {
          playAudio(data.audioBase64);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Quick prompt buttons
  const sendQuickPrompt = (promptText: string) => {
    processUserMessage(promptText);
  };

  // Hang Up & Trigger Autonomous Build
  const handleHangUpAndBuild = async () => {
    if (callState !== 'CONNECTED') return;

    // Stop recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setCallState('BUILDING');

    try {
      const res = await fetch('/api/webhooks/call-ended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: `voice-${Date.now()}`,
          callerNumber: '+919876543210',
          provider: 'web-terminal',
          transcript,
          durationSeconds: seconds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedProjectId(data.projectId);
        setTimeout(() => {
          router.push(`/projects/${data.projectId}`);
        }, 1500);
      } else {
        alert('Could not initiate build pipeline.');
        setCallState('CONNECTED');
      }
    } catch (err: any) {
      alert(`Error ending call: ${err.message}`);
      setCallState('CONNECTED');
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e]">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sarvam Bulbul & Saaras Real-Time Audio Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Voice Call Studio & Telephone Terminal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Call the AI software consultant, describe your website in English, Hindi or Marathi, and hang up to trigger automated build & Vercel deployment.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => setLanguage('en-IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'en-IN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi-IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'hi-IN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setLanguage('mr-IN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'mr-IN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>

        {/* Studio Body */}
        {callState === 'IDLE' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 text-center relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute w-[500px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-1 shadow-2xl shadow-emerald-500/20 mb-6 animate-pulse-subtle">
              <div className="w-full h-full bg-[#0a0f18] rounded-[22px] flex items-center justify-center">
                <PhoneCall className="w-9 h-9 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">Ready to Begin Your Voice Consultation</h2>
            <p className="text-slate-400 text-sm max-w-md mt-2">
              Our Sarvam-powered AI consultant will answer immediately. Speak naturally, articulate your features, and when satisfied, hang up to build.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartCall}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call AI Agent Now</span>
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
                <span className="font-semibold text-slate-300 block">1. Speak Naturally</span>
                <span className="text-slate-500">English, Hindi, Marathi or Hinglish accepted without prompt engineering.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
                <span className="font-semibold text-slate-300 block">2. Sarvam Telephony</span>
                <span className="text-slate-500">Bulbul:v3 neural voice synthesis & Saaras:v3 speech recognition.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
                <span className="font-semibold text-slate-300 block">3. Autonomous Vercel</span>
                <span className="text-slate-500">Scaffolding, GitHub push, automated testing & live deployment.</span>
              </div>
            </div>
          </div>
        ) : callState === 'DIALING' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 animate-bounce">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Connecting Call via Sarvam Gateway...</h3>
            <p className="text-slate-400 text-xs mt-1">Establishing low-latency neural voice stream</p>
          </div>
        ) : callState === 'BUILDING' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#0b0f19] border border-slate-800/80 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white">Call Disconnected — Autonomous Build Triggered!</h3>
            <p className="text-slate-400 text-sm max-w-md">
              The AI has ingested your requirements and is currently generating the Next.js components and initiating Vercel deployment.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to Project Workspace...</span>
            </div>
          </div>
        ) : (
          /* ACTIVE CONNECTED CALL */
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Left: Caller HUD */}
            <div className="lg:w-80 flex flex-col justify-between p-6 rounded-3xl bg-[#0b0f19] border border-slate-800/80">
              <div className="space-y-6 text-center">
                {/* Agent Avatar */}
                <div className="relative mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-1 shadow-xl shadow-indigo-500/20">
                    <div className="w-full h-full bg-[#0a0e18] rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-emerald-400" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0e18]" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Aditya (AI Architect)</h3>
                  <p className="text-xs text-slate-400">Sarvam Bulbul:v3 • Online</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{formatTimer(seconds)}</span>
                  </div>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="flex items-center justify-center gap-1 h-12 bg-slate-900/60 rounded-xl px-4 border border-slate-800/60">
                  {[40, 75, 90, 60, 100, 45, 80, 95, 65, 85, 50, 70].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isAiThinking || isRecording ? 'bg-emerald-400 animate-wave' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isAiThinking || isRecording ? `${h}%` : '20%',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Quick Requirement Prompts:
                  </span>
                  <button
                    onClick={() => sendQuickPrompt('I want a luxury hotel booking platform with dark mode, room listings, filters and booking modal.')}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 transition-colors border border-slate-800"
                  >
                    🏨 Luxury Hotel Platform
                  </button>
                  <button
                    onClick={() => sendQuickPrompt('Create an e-commerce website for tech gadgets with shopping cart and Supabase database.')}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 transition-colors border border-slate-800"
                  >
                    🛒 Tech E-commerce Store
                  </button>
                  <button
                    onClick={() => sendQuickPrompt('मुझे एक रियल एस्टेट की प्रीमियम डार्क वेबसाइट चाहिए जिसमें प्रॉपर्टी लिस्टिंग हो।')}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 transition-colors border border-slate-800"
                  >
                    🇮🇳 रियल एस्टेट (Hindi Voice)
                  </button>
                </div>
              </div>

              {/* Call Controls */}
              <div className="pt-6 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-center gap-3">
                  {/* Microphone Toggle */}
                  <button
                    onClick={handleToggleMic}
                    className={`p-3.5 rounded-full transition-all shadow-lg ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                    title={isRecording ? 'Mute Mic' : 'Speak into Mic'}
                  >
                    {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  {/* Audio Mute */}
                  <button
                    onClick={() => setAudioMuted(!audioMuted)}
                    className="p-3.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    title={audioMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                  >
                    {audioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                {/* Hang Up & Build Button */}
                <button
                  onClick={handleHangUpAndBuild}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Hang Up & Build Website</span>
                </button>
              </div>
            </div>

            {/* Right: Real-time Transcript & Input */}
            <div className="flex-1 flex flex-col rounded-3xl bg-[#0b0f19] border border-slate-800/80 overflow-hidden">
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Live Conversation Transcript</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {transcript.length} turns recorded
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[460px]">
                {transcript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.speaker === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500 font-medium">
                      <span>{msg.speaker === 'user' ? 'You' : 'VoxBuild AI (Aditya)'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.speaker === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sarvam AI is thinking and formulating response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  processUserMessage(textInput);
                }}
                className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={
                    isRecording
                      ? 'Listening to microphone... or type here...'
                      : 'Type instructions or click mic to speak...'
                  }
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || isAiThinking}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
