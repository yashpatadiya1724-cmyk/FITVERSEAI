'use client';

import React from 'react';
import { useFitStore } from '@/store/useFitStore';
import { Flame, Droplet, Footprints, Dumbbell, Award, Coins, Plus, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardCards: React.FC = () => {
  const { user, diet, logWater, addSteps, addCaloriesBurned, addXp, currentWorkout } = useFitStore();

  const cards = [
    {
      title: 'Calories Burned',
      value: `${currentWorkout?.caloriesBurned || 420} kcal`,
      subtext: 'Target: 500 kcal',
      icon: Flame,
      color: 'from-orange-500 to-amber-500',
      border: 'border-orange-500/30',
      textColor: 'text-orange-400',
      action: () => addCaloriesBurned(50),
      actionText: '+50 kcal Burn',
    },
    {
      title: 'Water Hydration',
      value: `${diet.waterLoggedMl} / ${diet.waterTargetMl} ml`,
      subtext: `${Math.round((diet.waterLoggedMl / diet.waterTargetMl) * 100)}% Reached`,
      icon: Droplet,
      color: 'from-cyan-500 to-blue-500',
      border: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      action: () => logWater(250),
      actionText: '+250ml Quick Log',
    },
    {
      title: 'Daily Steps',
      value: `${(user.dailySteps || 8450).toLocaleString()}`,
      subtext: `Goal: ${(user.dailyStepsTarget || 10000).toLocaleString()} steps`,
      icon: Footprints,
      color: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      action: () => addSteps(500),
      actionText: '+500 Steps',
    },
    {
      title: 'Workout Protocol',
      value: currentWorkout?.title || 'Hypertrophy Upper Body Protocol',
      subtext: `${currentWorkout?.durationMinutes || 45} mins • ${currentWorkout?.exercises.length || 3} exercises`,
      icon: Dumbbell,
      color: 'from-purple-500 to-indigo-500',
      border: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      title: 'XP Level',
      value: `Level ${Math.floor(user.xp / 100) + 1}`,
      subtext: `${user.xp} Total XP Points`,
      icon: Award,
      color: 'from-pink-500 to-rose-500',
      border: 'border-pink-500/30',
      textColor: 'text-pink-400',
      action: () => addXp(25),
      actionText: '+25 XP Boost',
    },
    {
      title: 'FitVerse Coins',
      value: `${user.coins} 🪙`,
      subtext: 'Unlock Avatar Gear',
      icon: Coins,
      color: 'from-yellow-500 to-amber-400',
      border: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`glass-card p-5 relative overflow-hidden border ${card.border} flex flex-col justify-between cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">{card.title}</span>
                <h4 className="text-2xl font-black text-white font-heading mt-1">{card.value}</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  {card.subtext}
                </p>
              </div>

              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/10`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {card.action ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  card.action?.();
                }}
                className="mt-4 w-full py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {card.actionText}
              </button>
            ) : (
              <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <Sparkles className="w-3 h-3" /> Live Synced
                </span>
                <span>Active Session</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
