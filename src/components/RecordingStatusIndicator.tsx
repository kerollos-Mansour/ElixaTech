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
      <div className="w-full p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200 flex items-start gap-3 animate-fade-in">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-300">Recording Error</p>
          <p className="text-sm text-red-200/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (status === 'recording') {
    return (
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-semibold tracking-wide uppercase">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>Recording Live</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest bg-slate-900/60 px-6 py-3 rounded-2xl border border-slate-700/50 shadow-lg">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
          <span>{formatDuration(duration)}</span>
        </div>

        {/* Audio visualizer */}
        <div className="flex items-center justify-center gap-2 h-12 px-6 py-3 rounded-xl bg-slate-900/40 border border-slate-800/50 w-64">
          <Volume2 className="w-5 h-5 text-red-400 mr-2 shrink-0" />
          {[...Array(11)].map((_, i) => {
            const factor = Math.sin((i + 1) * 0.35) * 0.5 + 0.5;
            const barHeight = Math.max(12, Math.min(100, (audioLevel * 100 * factor) + Math.random() * 25));
            return (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-red-600 to-rose-400 rounded-full transition-all duration-100"
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
      <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
          <span className="text-xl">⏳</span>
          <span>Processing audio...</span>
        </div>
        <p className="text-xs text-slate-500">Transcribing your voice with AI...</p>
      </div>
    );
  }

  return null;
};

export default RecordingStatusIndicator;