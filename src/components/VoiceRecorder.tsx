'use client';

import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import RecordingButton from './RecordingButton';
import RecordingStatusIndicator from './RecordingStatusIndicator';
import AudioPreview from './AudioPreview';
import TranscriptionResult from './TranscriptionResult';
import { Mic, Radio, Sparkles } from 'lucide-react';

export const VoiceRecorder: React.FC = () => {
  const {
    status,
    duration,
    audioBlob,
    audioUrl,
    error,
    audioLevel,
    startRecording,
    stopRecording,
    resetRecording,
    formatDuration,
  } = useAudioRecorder();

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Outer Card Container */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="text-center space-y-2 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Voice to Text</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
            Voice to Text
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Speak and convert your voice into text
          </p>
        </div>

        {/* Recording Status & Error Alerts */}
        <div className="mb-6 relative z-10">
          <RecordingStatusIndicator
            status={status}
            duration={duration}
            formatDuration={formatDuration}
            error={error}
            audioLevel={audioLevel}
          />
        </div>

        {/* Central Recording Control Button */}
        <div className="my-8 flex justify-center relative z-10">
          <RecordingButton
            status={status}
            audioLevel={audioLevel}
            onStart={startRecording}
            onStop={stopRecording}
            onReset={resetRecording}
          />
        </div>

        {/* Audio Preview Player (Visible when recording complete) */}
        {status === 'completed' && audioUrl && (
          <div className="mt-8 relative z-10 animate-fade-in">
            <AudioPreview
              audioUrl={audioUrl}
              audioBlob={audioBlob}
              duration={duration}
              formatDuration={formatDuration}
            />
          </div>
        )}

        {/* Divider */}
        <div className="my-6 border-t border-slate-800/80 relative z-10" />

        {/* Transcription Output Area */}
        <div className="relative z-10">
          <TranscriptionResult status={status} audioBlob={audioBlob} />
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;