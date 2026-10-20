'use client';

import React from 'react';
import { Mic, Square, RotateCcw, Loader2 } from 'lucide-react';
import { RecordingStatus } from '../hooks/useAudioRecorder';

interface RecordingButtonProps {
  status: RecordingStatus;
  audioLevel: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  status,
  audioLevel,
  onStart,
  onStop,
  onReset,
}) => {
  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';
  const isCompleted = status === 'completed';

  // Calculate dynamic glow/ring scale based on real mic volume level
  const ringScale = 1 + Math.max(0, audioLevel) * 0.45;
  const ringOpacity = 0.3 + Math.max(0, audioLevel) * 0.5;

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onReset}
          className="group relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="Record Again"
        >
          <RotateCcw className="w-5 h-5 transition-transform group-hover:-rotate-90 duration-500" />
          <span>Record Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer audio reactive aura rings when recording */}
      {isRecording && (
        <>
          <div
            className="absolute -inset-4 rounded-full bg-red-500/20 blur-xl transition-all duration-100 ease-out pointer-events-none"
            style={{
              transform: `scale(${ringScale * 1.15})`,
              opacity: ringOpacity,
            }}
          />
          <div
            className="absolute -inset-2 rounded-full border-2 border-red-500/40 transition-all duration-100 ease-out pointer-events-none"
            style={{
              transform: `scale(${ringScale})`,
            }}
          />
        </>
      )}

      {/* Outer idle glow */}
      {status === 'idle' && (
        <div className="absolute -inset-2 rounded-full bg-indigo-500/20 blur-md animate-pulse pointer-events-none" />
      )}

      {/* Main Microphone / Stop / Loader Button */}
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={isProcessing}
        className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 ${
          isRecording
            ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 text-white shadow-xl shadow-red-600/40 ring-red-500/50 active:scale-95'
            : isProcessing
            ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
            : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-600/35 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 ring-indigo-400/50'
        }`}
        aria-label={
          isRecording
            ? 'Stop Recording'
            : isProcessing
            ? 'Processing audio'
            : 'Start Recording'
        }
      >
        {isProcessing ? (
          <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
        ) : isRecording ? (
          <Square className="w-9 h-9 fill-current text-white animate-pulse" />
        ) : (
          <Mic className="w-10 h-10 text-white drop-shadow-md" />
        )}
      </button>

      {/* Button Label */}
      <div className="mt-4 text-center">
        <span className="text-sm font-semibold tracking-wide text-slate-300">
          {isRecording ? (
            <span className="text-red-400 animate-pulse flex items-center gap-1.5 justify-center">
              Stop Recording
            </span>
          ) : isProcessing ? (
            <span className="text-indigo-300">Processing Audio...</span>
          ) : (
            'Start Recording'
          )}
        </span>
      </div>
    </div>
  );
};

export default RecordingButton;