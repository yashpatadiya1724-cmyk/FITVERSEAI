'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFitStore } from '@/store/useFitStore';
import { FitVerseVoiceEngine } from '@/lib/voiceEngine';
import { MoodType } from '@/types';
import { Zap, Flame, Award, Mic, Sun, Moon, Sparkles, LogIn, LogOut, Volume2 } from 'lucide-react';

interface NavbarProps {
  onToggleAuthModal?: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'workout' | 'diet' | 'avatar' | 'music' | 'analytics' | 'rewards' | 'settings' | 'notifications') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleAuthModal, onNavigateTab }) => {
  const { user, isLoggedIn, logout, isVoiceActive, toggleVoiceAssistant, logWater, mood, setMood, theme, toggleTheme } = useFitStore();
  const [voiceFeedbackText, setVoiceFeedbackText] = useState<string | null>(null);

  const voiceEngineRef = useRef<FitVerseVoiceEngine | null>(null);

  useEffect(() => {
    voiceEngineRef.current = new FitVerseVoiceEngine({
      onNavigate: (tab) => onNavigateTab?.(tab),
      onLogWater: () => logWater(250),
      onToggleTheme: () => toggleTheme(),
      onFeedback: (msg) => {
        setVoiceFeedbackText(msg);
        setTimeout(() => setVoiceFeedbackText(null), 4000);
      },
    });
  }, [onNavigateTab, logWater, toggleTheme]);

  const handleVoiceToggle = () => {
    toggleVoiceAssistant();
    if (!isVoiceActive) {
      voiceEngineRef.current?.startListening();
    } else {
      voiceEngineRef.current?.stopListening();
    }
  };

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00e5ff] to-[#8b5cf6] flex items-center justify-center text-[#050816] font-extrabold text-xl shadow-[0_0_15px_rgba(0,229,255,0.5)]">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-wider">
            FITVERSE<span className="text-[#00e5ff] cyan-glow">AI</span>
          </span>
          <span className="block text-[10px] tracking-widest text-slate-400 uppercase">Premium Neural Fitness</span>
        </div>
      </div>

      {/* Center Feedback Toast or Badges */}
      {voiceFeedbackText ? (
        <div className="animate-bounce px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>{voiceFeedbackText}</span>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-full premium-badge flex items-center gap-1.5 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>PRO ECOSYSTEM</span>
          </div>

          <div className="px-4 py-1.5 rounded-full glass-card flex items-center gap-2 border border-amber-500/30 text-amber-500 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{user.streakDays} Day Streak</span>
          </div>

          <div className="px-4 py-1.5 rounded-full glass-card flex items-center gap-2 border border-purple-500/30 text-purple-400 text-xs font-semibold">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Lvl {Math.floor(user.xp / 100) + 1} ({user.xp} XP)</span>
          </div>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value as MoodType)}
            className="bg-slate-900/80 text-xs text-cyan-300 border border-[#00e5ff]/30 rounded-full px-3 py-1.5 focus:outline-none focus:border-[#00e5ff] cursor-pointer"
          >
            <option value="motivated">🔥 Motivated</option>
            <option value="happy">😃 Energetic</option>
            <option value="tired">💤 Tired / Rest</option>
            <option value="sad">🌧️ Focused Chill</option>
            <option value="lazy">⚡ Push Mode</option>
          </select>
        </div>
      )}

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full glass-card border border-slate-700 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title={theme === 'dark' ? 'Switch to Lite Theme' : 'Switch to Dark Cyber Theme'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          <span className="hidden sm:inline capitalize">{theme === 'dark' ? 'Lite Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={handleVoiceToggle}
          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
            isVoiceActive
              ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.6)] animate-pulse'
              : 'glass-card border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Voice Assistant (Speech Commands)"
        >
          <Mic className="w-5 h-5" />
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-300 font-bold text-sm">
                {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-white">{user.fullName || user.username}</span>
            <button
              onClick={logout}
              className="p-2 rounded-full glass-card border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onToggleAuthModal}
            className="cyber-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};
