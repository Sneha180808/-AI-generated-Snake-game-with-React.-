import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { motion } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <>
      {/* Now Playing */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-accent to-accent-alt flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{currentTrack.title}</div>
          <div className="text-[10px] text-text-dim uppercase tracking-wider">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={skipBackward} className="text-text-dim hover:text-text transition-colors">
            <SkipBack size={18} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-text text-bg flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={skipForward} className="text-text-dim hover:text-text transition-colors">
            <SkipForward size={18} />
          </button>
        </div>
        <div className="w-full max-w-md flex items-center gap-3">
          <span className="text-[10px] font-mono text-text-dim">01:22</span>
          <div className="flex-grow h-1 bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-dim">03:42</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex justify-end items-center gap-3 text-text-dim">
        <Volume2 size={16} />
        <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
          <div className="w-[70%] h-full bg-text-dim" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
    </>
  );
};
