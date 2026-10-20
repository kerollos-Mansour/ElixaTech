'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as RecordRTC from 'recordrtc';

/**
 * Recording status types
 */
export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'completed' | 'error';

/**
 * Return type for useAudioRecorder hook
 */
export interface UseAudioRecorderReturn {
  status: RecordingStatus;
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  audioLevel: number; // Normalized 0-1 for visualizer animation
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
  formatDuration: (seconds: number) => string;
}

/**
 * Hook for audio recording using RecordRTC
 * Returns recording controls and state
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // RecordRTC ref for WAV recording
  const recordrtcRef = useRef<RecordRTC.StereoAudioRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  // Format seconds to MM:SS
  const formatDuration = useCallback((seconds: number): string => {
    if (seconds === undefined || seconds === null || !isFinite(seconds) || isNaN(seconds)) {
      return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup object URL
  const cleanupAudioUrl = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
  }, []);

  // Stop microphone stream & Web Audio API nodes
  const stopStream = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recordrtcRef.current) {
      // StereoAudioRecorder doesn't have a destroy method
      // The stream is already stopped and internal resources will be cleaned up
      recordrtcRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Start recording logic using StereoAudioRecorder for WAV output
  const startRecording = useCallback(async () => {
    setError(null);
    cleanupAudioUrl();
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);

    // Check browser support
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      const msg = 'Audio recording is not supported in this browser environment.';
      setError(msg);
      setStatus('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Web Audio API setup for live audio visualizer
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            setAudioLevel(Math.min(1, average / 128));
            animFrameRef.current = requestAnimationFrame(updateLevel);
          }
        };
        updateLevel();
      } catch (e) {
        console.warn('Web Audio visualizer initialization failed:', e);
      }

      // Use StereoAudioRecorder with proper configuration
      const recordrtc = new RecordRTC.StereoAudioRecorder(stream, {
        mimeType: 'audio/wav',
        bufferSize: 4096,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      recordrtcRef.current = recordrtc;

      // Record for a minimum of 1 second to ensure audio capture
      recordrtc.record();
      setStatus('recording');

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

    } catch (err: unknown) {
      console.error('Error starting recording:', err);
      let errorMsg = 'Could not access microphone.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = 'Microphone access denied. Please allow microphone permissions in your browser.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMsg = 'No microphone device found on your system.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMsg = 'Microphone is already in use by another application.';
        }
      }
      setError(errorMsg);
      setStatus('error');
      stopStream();
    }
  }, [cleanupAudioUrl, stopStream]);

  // Stop recording logic
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recordrtcRef.current) {
      setStatus('processing');

      // Stop recording and get the WAV blob
      recordrtcRef.current.stop((wavBlob) => {
        const wavUrl = URL.createObjectURL(wavBlob);

        currentUrlRef.current = wavUrl;
        setAudioBlob(wavBlob);
        setAudioUrl(wavUrl);

        recordrtcRef.current = null;

        // Transition from processing -> completed
        setStatus('completed');
        stopStream();
      });
    } else {
      stopStream();
      setStatus('idle');
    }
  }, [stopStream]);

  // Reset recording logic
  const resetRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recordrtcRef.current) {
      // Stop and clear the recorder
      const recorder = recordrtcRef.current;
      try {
        recorder.stop(() => {
          recorder.clearRecordedData();
          recordrtcRef.current = null;
        });
      } catch {
        // Ignore errors during reset
      }
    }

    stopStream();
    cleanupAudioUrl();
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    setStatus('idle');
  }, [cleanupAudioUrl, stopStream]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopStream();
      cleanupAudioUrl();
    };
  }, [cleanupAudioUrl, stopStream]);

  return {
    status,
    isRecording: status === 'recording',
    isProcessing: status === 'processing',
    duration,
    audioBlob,
    audioUrl,
    error,
    audioLevel,
    startRecording,
    stopRecording,
    resetRecording,
    formatDuration,
  };
}

export default useAudioRecorder;