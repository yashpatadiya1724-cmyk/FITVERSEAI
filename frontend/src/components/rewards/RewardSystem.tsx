'use client';

import React from 'react';
import { useFitStore } from '@/store/useFitStore';
import { Award, Coins, Flame, Trophy, Shield, Sparkles, CheckCircle2, Gift, Lock } from 'lucide-react';

export const RewardSystem: React.FC = () => {
  const { user, avatar, addXp } = useFitStore();

  const achievements = [
    { title: 'First Ascent', desc: 'Complete 1 Workout', xp: 50, unlocked: true },
    { title: 'Hydration Warrior', desc: 'Reach 3,000ml Daily Water Goal', xp: 100, unlocked: true },
    { title: '7-Day Cyber Streak', desc: 'Maintain streak for 7 consecutive days', xp: 250, unlocked: false },
    { title: 'Avatar Evolved', desc: 'Reach Avatar Level 5', xp: 500, unlocked: false },
  ];

  return (
    <div className="glass-card p-6 space-y-6 border border-yellow-500/20">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Gamification & Cyber Reward Center
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Earn XP, FitVerse Coins, Level up your avatar, and unlock exclusive accessories.
          </p>
        </div>

        <button
          onClick={() => addXp(50)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:scale-105 transition-all cursor-pointer"
        >
          <Gift className="w-4 h-4" /> Claim Daily Reward (+50 XP)
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase">XP Level</span>
            <h4 className="text-lg font-extrabold text-white">Level {Math.floor(user.xp / 100) + 1}</h4>
            <span className="text-[10px] text-amber-400 font-semibold">{user.xp} Total XP</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-950/40 to-slate-950 border border-yellow-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-bold text-lg">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase">FitVerse Coins</span>
            <h4 className="text-lg font-extrabold text-white">{user.coins} 🪙</h4>
            <span className="text-[10px] text-yellow-400 font-semibold">Store Ready</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 to-slate-950 border border-orange-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Streak Bonus</span>
            <h4 className="text-lg font-extrabold text-white">{user.streakDays} Days</h4>
            <span className="text-[10px] text-orange-400 font-semibold">Active Streak</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Avatar Rank</span>
            <h4 className="text-lg font-extrabold text-white capitalize">{avatar.bodyType}</h4>
            <span className="text-[10px] text-purple-400 font-semibold">Stage {avatar.level}</span>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Milestones & Achievement Badges
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                ach.unlocked
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-md'
                  : 'bg-slate-950/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${ach.unlocked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  {ach.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{ach.title}</h5>
                  <p className="text-[11px] text-slate-400">{ach.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400">+{ach.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
