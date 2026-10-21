'use client';

import dynamic from 'next/dynamic';

const VoiceRecorder = dynamic(() => import('@/components/VoiceRecorder'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-400" />
      <p className="mt-4 text-slate-400">Loading voice recorder...</p>
    </div>
  ),
});

export default function VoiceToTextPage() {
  return (
 <main className="relative min-h-screen bg-slate-950 px-4 pt-28 pb-10 sm:px-6">      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-72 w-  72 rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            AI-Powered Speech Recognition
          </div>
          <h1 className="mb-5 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Voice to Text
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Turn your voice into text with ease. Record your speech and let
            intelligent speech recognition do the rest.
          </p>
        </header>

        {/* Recorder Card */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl sm:p-8 md:p-10">
          <VoiceRecorder />
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Clear audio delivers better transcription results.
          </p>
        </footer>
      </div>
    </main>
  );
}