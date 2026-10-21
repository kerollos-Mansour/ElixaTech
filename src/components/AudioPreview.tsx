'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Music, FileAudio } from 'lucide-react';

interface AudioPreviewProps {
  audioUrl: string | null;
  audioBlob: Blob | null;
  duration: number;
  formatDuration: (sec: number) => string;
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioUrl,
  audioBlob,
  duration,
  formatDuration,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (duration > 0) {
      setAudioDuration(duration);
    }
  }, [audioUrl, duration]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (
      audioRef.current &&
      audioRef.current.duration &&
      !isNaN(audioRef.current.duration) &&
      isFinite(audioRef.current.duration)
    ) {
      setAudioDuration(Math.round(audioRef.current.duration));
    } else {
      setAudioDuration(duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5 shadow-xl backdrop-blur-md transition-all duration-300">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label="Audio player"
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Recorded Audio</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <FileAudio className="w-3.5 h-3.5 text-slate-500" />
              <span>{audioBlob ? formatFileSize(audioBlob.size) : 'Audio clip'}</span>
              <span>•</span>
              <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {audioBlob?.type.split(';')[0] || 'audio/webm'}
              </span>
            </div>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Scrub Bar & Timers */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={audioDuration || 1}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(audioDuration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPreview;