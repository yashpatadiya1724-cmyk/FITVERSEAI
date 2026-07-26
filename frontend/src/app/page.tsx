'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AuthPage } from '@/components/auth/AuthPage';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { HologramAvatar } from '@/components/3d/HologramAvatar';
import { ExerciseHologramModal } from '@/components/3d/ExerciseHologramModal';
import { AvatarSelector } from '@/components/avatar/AvatarSelector';
import { ExerciseManager } from '@/components/workout/ExerciseManager';
import { DietPlannerView } from '@/components/diet/DietPlannerView';
import { MusicPlayerExpanded } from '@/components/music/MusicPlayerExpanded';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { SettingsView } from '@/components/settings/SettingsView';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { AICoachChat } from '@/components/coach/AICoachChat';
import { useFitStore } from '@/store/useFitStore';
import { Exercise } from '@/types';
import { LayoutDashboard, Dumbbell, Utensils, User, Music, Activity, Trophy, Settings, Bell, ChevronRight, Crown, Sparkles } from 'lucide-react';

export default function Home() {
  const { theme, isLoggedIn, isOnboarded, setOnboarded } = useFitStore();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'workout' | 'diet' | 'avatar' | 'music' | 'analytics' | 'rewards' | 'settings' | 'notifications'
  >('dashboard');

  const [selectedHologramExercise, setSelectedHologramExercise] = useState<Exercise | null>(null);
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout', label: 'Workouts & Holograms', icon: Dumbbell },
    { id: 'diet', label: 'AI Diet & Water', icon: Utensils },
    { id: 'avatar', label: 'Avatars & Gear', icon: User },
    { id: 'music', label: 'Spotify Audio', icon: Music },
    { id: 'analytics', label: '3D Analytics', icon: Activity },
    { id: 'rewards', label: 'Rewards & Level Up', icon: Trophy },
    { id: 'settings', label: 'Settings & Light', icon: Settings },
    { id: 'notifications', label: 'Knowledge & Logs', icon: Bell },
  ] as const;

  return (
    <div data-theme={theme} className="min-h-screen relative pb-16 transition-colors duration-400">
      {/* Background Aurora Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-cyan"></div>
        <div className="aurora-blob blob-purple"></div>
        <div className="aurora-blob blob-green"></div>
      </div>

      {/* Glass Navigation Bar */}
      <Navbar
        onToggleAuthModal={() => setShowAuthScreen(!showAuthScreen)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-6 pt-28 space-y-8">
        {/* STEP 1: LOGIN / SIGN UP PAGE */}
        {!isLoggedIn || showAuthScreen ? (
          <AuthPage />
        ) : !isOnboarded ? (
          /* STEP 2: 7-STEP ONBOARDING & AVATAR SELECTION WIZARD */
          <OnboardingWizard onComplete={() => setOnboarded(true)} />
        ) : (
          /* STEP 3: MAIN DASHBOARD & ECOSYSTEM TABS */
          <>
            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                        : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Hero Welcome Banner */}
                <section className="glass-card p-8 relative overflow-hidden border border-cyan-500/20">
                  <div className="max-w-2xl space-y-3 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase">
                      <Crown className="w-4 h-4 text-amber-400" /> Premium AI Fitness OS
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight font-heading">
                      Ascend Beyond Limits with <br />
                      <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent cyan-glow">
                        FitVerse Neural AI
                      </span>
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      JARVIS AI coach compiles metabolic protocols, 3D Mixamo-style holograms, fluid water tracking, morphable avatar frames, and mood-synced audio.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('workout')}
                        className="cyber-btn px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
                      >
                        Launch 3D Hologram Workouts <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setOnboarded(false)}
                        className="px-5 py-2.5 rounded-full glass-card border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-bold hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" /> Re-configure DNA Onboarding
                      </button>
                    </div>
                  </div>
                </section>

                {/* Daily Metrics Dashboard Cards */}
                <section className="space-y-4">
                  <h2 className="text-xl font-extrabold flex items-center gap-2 font-heading">
                    <Dumbbell className="w-5 h-5 text-cyan-400" /> Neural Analytics & Telemetry
                  </h2>
                  <DashboardCards />
                </section>

                {/* 3D Hologram & AI Coach Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <HologramAvatar />
                  <AICoachChat />
                </section>
              </div>
            )}

            {/* Tab 2: Workouts & Hologram Manager */}
            {activeTab === 'workout' && (
              <div className="space-y-8 animate-fadeIn">
                <ExerciseManager onOpenHologram={(ex) => setSelectedHologramExercise(ex)} />
              </div>
            )}

            {/* Tab 3: AI Diet & Health View */}
            {activeTab === 'diet' && (
              <div className="space-y-8 animate-fadeIn">
                <DietPlannerView />
              </div>
            )}

            {/* Tab 4: Avatars & Evolution */}
            {activeTab === 'avatar' && (
              <div className="space-y-8 animate-fadeIn">
                <AvatarSelector />
              </div>
            )}

            {/* Tab 5: Audio Music Player */}
            {activeTab === 'music' && (
              <div className="space-y-8 animate-fadeIn">
                <MusicPlayerExpanded />
              </div>
            )}

            {/* Tab 6: 3D Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-fadeIn">
                <AnalyticsView />
              </div>
            )}

            {/* Tab 7: Gamified Rewards */}
            {activeTab === 'rewards' && (
              <div className="space-y-8 animate-fadeIn">
                <RewardSystem />
              </div>
            )}

            {/* Tab 8: System Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fadeIn">
                <SettingsView />
              </div>
            )}

            {/* Tab 9: Hydration & Knowledge Base */}
            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-fadeIn">
                <NotificationCenter />
              </div>
            )}
          </>
        )}

        {/* 3D Exercise Hologram Modal overlay */}
        {selectedHologramExercise && (
          <ExerciseHologramModal
            exercise={selectedHologramExercise}
            onClose={() => setSelectedHologramExercise(null)}
          />
        )}
      </main>
    </div>
  );
}

