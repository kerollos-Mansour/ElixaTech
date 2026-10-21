'use client';

import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import RecordingButton from './RecordingButton';
import RecordingStatusIndicator from './RecordingStatusIndicator';
import AudioPreview from './AudioPreview';
import TranscriptionResult from './TranscriptionResult';

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
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-4">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          AI-Powered Speech Recognition
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight mb-2">
          Voice to Text
        </h2>

        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Click the microphone to start recording. Your speech will be transcribed automatically.
        </p>
      </div>

      {/* Recording Status & Error */}
      <div className="mb-8">
        <RecordingStatusIndicator
          status={status}
          duration={duration}
          formatDuration={formatDuration}
          error={error}
          audioLevel={audioLevel}
        />
      </div>

      {/* Recording Control Button */}
      <div className="my-10 flex justify-center">
        <RecordingButton
          status={status}
          audioLevel={audioLevel}
          onStart={startRecording}
          onStop={stopRecording}
          onReset={resetRecording}
        />
      </div>

      {/* Audio Preview */}
      {status === 'completed' && audioUrl && (
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
            <h3 className="text-center text-indigo-300 font-medium mb-4">Audio Preview</h3>
            <AudioPreview
              audioUrl={audioUrl}
              audioBlob={audioBlob}
              duration={duration}
              formatDuration={formatDuration}
            />
          </div>
        </div>
      )}

      {/* Transcription Result */}
      <div className="animate-fade-in">
        <TranscriptionResult status={status} audioBlob={audioBlob} />
      </div>
    </div>
  );
};

export default VoiceRecorder;