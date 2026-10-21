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
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-700/50 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 tracking-wide">Transcription</h3>
        </div>
        {transcription && (
          <button
            onClick={copyToClipboard}
            className="text-xs px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 font-medium"
            aria-label="Copy transcription"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : null}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        )}
      </div>

      <div className="min-h-[200px]">
        {isTranscribing && (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-indigo-300 h-full animate-fade-in">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <div>
              <p className="text-sm font-medium mb-1">Transcribing your voice...</p>
              <p className="text-xs text-slate-500">Sending audio to Whisper via backend</p>
            </div>
          </div>
        )}

        {!isTranscribing && transcription && (
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-white font-sans text-base leading-relaxed break-words tracking-wide animate-fade-in">
            "{transcription}"
          </div>
        )}

        {!isTranscribing && !transcription && !apiError && (
          <div className="text-center py-12 px-4 text-slate-500">
            <p className="text-sm italic">
              {isCompleted
                ? 'Transcription will appear here after processing.'
                : 'Start recording to generate transcription.'}
            </p>
          </div>
        )}
      </div>

      {apiError && !isTranscribing && (
        <div className="mt-5 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200 text-sm flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Transcription Error</p>
            <p className="text-red-300/80 mt-1 leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionResult;