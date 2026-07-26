'use client';

import React, { useState } from 'react';
import { useFitStore } from '@/store/useFitStore';
import { Exercise } from '@/types';
import { Dumbbell, Plus, Trash2, RefreshCw, Box, Camera } from 'lucide-react';
import { ExercisePoseDetector } from '@/components/camera/ExercisePoseDetector';

interface Props {
  onOpenHologram: (exercise: Exercise) => void;
}

export const ExerciseManager: React.FC<Props> = ({ onOpenHologram }) => {
  const { currentWorkout, addExercise, removeExercise, replaceExerciseWithAi, regenerateWorkoutPlan } = useFitStore();
  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState('Chest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activePoseExercise, setActivePoseExercise] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx: Exercise = {
      id: `ex_${Date.now()}`,
      name: newExName,
      category: 'Strength',
      sets: 4,
      reps: 12,
      restSec: 45,
      targetMuscle: newExMuscle,
      secondaryMuscles: ['Core'],
      instructions: ['Maintain strict form', 'Control the eccentric movement'],
      hologramColor: '#00e5ff',
      modelType: 'cylinder',
    };

    addExercise(newEx);
    setNewExName('');
    setShowAddForm(false);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Active Camera Pose Detector Modal */}
      {activePoseExercise && (
        <ExercisePoseDetector
          exerciseName={activePoseExercise}
          onClose={() => setActivePoseExercise(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-cyan-400" /> Dynamic Exercise Management & Protocol
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add, remove, or swap exercises with AI recommendations. Auto-regenerates intensity metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#00e5ff] text-xs font-bold flex items-center gap-1.5 hover:bg-[#00e5ff]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
          <button
            onClick={regenerateWorkoutPlan}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> AI Regenerate
          </button>
        </div>
      </div>

      {/* Add Exercise Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
          <h4 className="text-sm font-bold text-cyan-300">Add New Exercise Protocol</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Exercise Name (e.g. Cable crossovers)"
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <select
              value={newExMuscle}
              onChange={(e) => setNewExMuscle(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none"
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Quadriceps">Quadriceps</option>
              <option value="Hamstrings">Hamstrings</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Triceps">Triceps</option>
              <option value="Biceps">Biceps</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Save Exercise
            </button>
          </div>
        </form>
      )}

      {/* Workout Overview Stats */}
      {currentWorkout && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Current Routine:</span>
            <h4 className="text-sm font-bold text-white mt-0.5">{currentWorkout.title}</h4>
          </div>
          <div className="flex gap-4">
            <div>
              <span className="text-slate-400 block text-[10px]">Duration</span>
              <span className="font-bold text-cyan-300">{currentWorkout.durationMinutes} mins</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Est. Calories</span>
              <span className="font-bold text-amber-400">{currentWorkout.caloriesBurned} kcal</span>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List Cards */}
      <div className="space-y-3">
        {currentWorkout?.exercises.map((ex, idx) => (
          <div
            key={ex.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                {idx + 1}
              </div>
              <div>
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  {ex.name}
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 font-normal">
                    {ex.targetMuscle}
                  </span>
                </h5>
                <p className="text-xs text-slate-400">
                  {ex.sets} Sets • {ex.reps} Reps • {ex.restSec}s Rest
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenHologram(ex)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/30 transition-all cursor-pointer"
              >
                <Box className="w-3.5 h-3.5" /> View Hologram
              </button>

              <button
                onClick={() => setActivePoseExercise(ex.name)}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-500/30 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" /> Camera AI
              </button>

              <button
                onClick={() => replaceExerciseWithAi(ex.id)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all cursor-pointer"
                title="AI Swap"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => removeExercise(ex.id)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-all cursor-pointer"
                title="Remove Exercise"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
