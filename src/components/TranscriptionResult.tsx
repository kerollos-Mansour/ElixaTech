'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileText, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { transcribeAudio } from '../services/transcriptionService';
import { RecordingStatus } from '../hooks/useAudioRecorder';

interface TranscriptionResultProps {
  status: RecordingStatus;
  audioBlob: Blob | null;
}

export const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  status,
  audioBlob,
}) => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const transcribedBlobRef = useRef<Blob | null>(null);

  // Automatically transcribe when audio blob becomes available after recording stops
  useEffect(() => {
    if (
      status === 'completed' &&
      audioBlob &&
      audioBlob !== transcribedBlobRef.current &&
      !isTranscribing
    ) {
      transcribedBlobRef.current = audioBlob;
      setTranscription(null);
      setApiError(null);
      setIsTranscribing(true);

      transcribeAudio(audioBlob)
        .then((res) => {
          if (res.success && res.text) {
            setTranscription(res.text);
          } else {
            setApiError(res.error ?? 'Transcription returned no text.');
          }
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : 'Unknown error during transcription.';
          setApiError(message);
        })
        .finally(() => {
          setIsTranscribing(false);
        });
    }

    // Reset state when a new recording starts
    if (status === 'idle' || status === 'recording') {
      setTranscription(null);
      setApiError(null);
      transcribedBlobRef.current = null;
    }
  }, [status, audioBlob]);

  const copyToClipboard = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCompleted = status === 'completed';

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide">Transcription</h3>
        </div>
        {transcription && (
          <button
            onClick={copyToClipboard}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
            aria-label="Copy transcription"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[100px] flex flex-col justify-center">
        {/* Auto-transcribing spinner */}
        {isTranscribing && (
          <div className="flex flex-col items-center gap-2 py-4 text-indigo-300 animate-fade-in">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-sm font-medium">Transcribing your voice...</p>
            <p className="text-xs text-slate-500">Sending audio to Whisper via backend...</p>
          </div>
        )}

        {/* Successful transcription */}
        {!isTranscribing && transcription && (
          <div
            dir="auto"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-white font-sans text-base leading-relaxed break-words tracking-wide animate-fade-in"
          >
            &quot;{transcription}&quot;
          </div>
        )}

        {/* Idle / waiting state */}
        {!isTranscribing && !transcription && !apiError && (
          <div className="text-center py-4 px-2">
            <p className="text-slate-400 text-sm italic">
              {isCompleted
                ? 'Processing complete. Transcription not yet available.'
                : 'Your transcription will appear here...'}
            </p>
          </div>
        )}
      </div>

      {/* API Error Display */}
      {apiError && !isTranscribing && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-red-200">Transcription Error</p>
            <p className="text-red-300/90 leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionResult;