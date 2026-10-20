'use client';

import React from 'react';
import { AlertCircle, Clock, Volume2 } from 'lucide-react';
import { RecordingStatus } from '../hooks/useAudioRecorder';

interface RecordingStatusProps {
  status: RecordingStatus;
  duration: number;
  formatDuration: (sec: number) => string;
  error: string | null;
  audioLevel: number;
}

export const RecordingStatusIndicator: React.FC<RecordingStatusProps> = ({
  status,
  duration,
  formatDuration,
  error,
  audioLevel,
}) => {
  if (error) {
    return (
      <div className="w-full p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-start gap-3 text-sm">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-red-300">Recording Error</p>
          <p className="mt-0.5 text-red-200/90 text-xs leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (status === 'recording') {
    return (
      <div className="flex flex-col items-center gap-3 w-full animate-fade-in">
        {/* Live status badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Recording Live</span>
        </div>

        {/* Dynamic timer display */}
        <div className="flex items-center gap-2 text-3xl font-mono font-bold text-white tracking-widest bg-slate-900/60 px-5 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <Clock className="w-5 h-5 text-red-400 animate-pulse" />
          <span>{formatDuration(duration)}</span>
        </div>

        {/* Animated Real-time Sound Wave Bars */}
        <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 w-48">
          <Volume2 className="w-4 h-4 text-red-400 mr-1 shrink-0" />
          {[...Array(9)].map((_, i) => {
            const factor = Math.sin((i + 1) * 0.4) * 0.5 + 0.5;
            const barHeight = Math.max(15, Math.min(100, (audioLevel * 100 * factor) + Math.random() * 20));
            return (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-red-600 to-rose-400 rounded-full transition-all duration-75"
                style={{
                  height: `${barHeight}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center gap-2 text-slate-300 py-2 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-sm font-medium">
          <span className="text-lg">⏳</span>
          <span>Processing audio...</span>
        </div>
        <p className="text-xs text-slate-400">Transcribing your voice...</p>
      </div>
    );
  }

  return null;
};

export default RecordingStatusIndicator;