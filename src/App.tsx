import React, { useState, useEffect } from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { GlitchText } from './components/GlitchText';
import { TRACKS } from './constants';
import { Terminal, Cpu, Activity, ShieldAlert, ListMusic, BarChart3, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [bootTime, setBootTime] = useState('');

  useEffect(() => {
    setBootTime(new Date().toISOString().replace('T', ' ').substring(0, 19));
  }, []);

  return (
    <div className="h-screen w-screen bg-bg text-text font-sans grid grid-cols-[280px_1fr_280px] grid-rows-[60px_1fr_100px] overflow-hidden">
      {/* Header */}
      <header className="col-span-full bg-surface border-b border-border px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="logo font-mono font-bold text-xl text-accent tracking-[0.2em]">
            SYNTH-SNAKE
          </div>
        </div>
        
        <div className="flex items-center gap-8 text-[10px] text-text-dim uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-accent-alt animate-pulse" />
            <span>SYSTEM: OPTIMAL</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-accent" />
            <span>LATENCY: 12MS</span>
          </div>
          <div className="border-l border-border pl-8 font-mono">
            {bootTime}
          </div>
        </div>
      </header>

      {/* Sidebar Left - Playlist */}
      <aside className="bg-surface border-r border-border p-6 flex flex-col gap-8 overflow-y-auto">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-4 flex items-center gap-2">
            <ListMusic size={14} /> Playlist
          </h3>
          <div className="space-y-2">
            {TRACKS.map((track, idx) => (
              <div 
                key={track.id} 
                className={`p-3 rounded-lg border transition-all cursor-pointer ${idx === 0 ? 'bg-accent/5 border-accent/20' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="text-sm font-medium">{track.title}</div>
                <div className="text-[10px] text-text-dim uppercase tracking-wider mt-1">{track.artist} • 3:42</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Visualization
          </h3>
          <div className="h-24 flex items-end gap-1 px-1">
            {[40, 70, 90, 60, 80, 30, 50, 85, 45, 65].map((h, i) => (
              <motion.div 
                key={i}
                className="flex-1 bg-accent"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ repeat: Infinity, duration: 1 + i * 0.1, repeatType: 'reverse' }}
                style={{ opacity: 0.3 + (h / 100) * 0.5 }}
              />
            ))}
          </div>
        </section>
      </aside>

      {/* Main View - Center */}
      <main className="bg-bg p-8 flex flex-col items-center justify-center gap-6 relative">
        <SnakeGame />
        <div className="font-mono text-[10px] text-text-dim tracking-widest uppercase">
          WASD TO MOVE • SPACE TO START
        </div>
      </main>

      {/* Sidebar Right - Stats */}
      <aside className="bg-surface border-l border-border p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="sleek-card">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">Current Score</h3>
          <div className="font-mono text-3xl text-accent font-bold">00,420</div>
        </div>

        <div className="sleek-card">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">High Score</h3>
          <div className="font-mono text-3xl text-text-dim font-bold">01,250</div>
        </div>

        <div className="mt-auto sleek-card">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-4">Active Effects</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-text-dim">Speed</span>
              <span className="text-accent font-bold">1.2x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-dim">Multiplier</span>
              <span className="text-accent font-bold">x5</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Footer - Player Controls */}
      <footer className="col-span-full bg-surface border-t border-border px-8 grid grid-cols-[280px_1fr_280px] items-center z-50">
        <MusicPlayer />
      </footer>
    </div>
  );
}
