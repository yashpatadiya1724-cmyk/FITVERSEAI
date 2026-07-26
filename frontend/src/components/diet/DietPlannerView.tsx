'use client';

import React, { useState } from 'react';
import { useFitStore } from '@/store/useFitStore';
import { calculateHealthMetrics } from '@/lib/healthCalculations';
import { Utensils, Sparkles, RefreshCw, Droplet, Plus, Check, ShoppingBag, BookOpen, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DietPlannerView: React.FC = () => {
  const { user, diet, logWater, updateUserProfile, generateAiDietPlan } = useFitStore();
  const metrics = calculateHealthMetrics(user);

  const [country, setCountry] = useState(user.country || 'USA');
  const [preference, setPreference] = useState(user.dietaryPreference || 'Non-Vegetarian');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>(user.budget || 'medium');
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>(['Oats', 'Whey Protein']);

  const handleRegenerate = () => {
    updateUserProfile({ country, dietaryPreference: preference, budget });
    generateAiDietPlan();
  };

  const toggleShoppingItem = (item: string) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter((i) => i !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const waterPercent = Math.min(100, Math.round((diet.waterLoggedMl / diet.waterTargetMl) * 100));

  const mealImages: Record<string, string> = {
    breakfast: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
    lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    dinner: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    snack: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <div className="glass-card p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-2 font-heading">
            <Utensils className="w-6 h-6 text-emerald-400" /> AI Metabolic Diet & Hydration Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Precision macros (Mifflin-St Jeor TDEE formula), recipe compilation, and fluid wave water tracking.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Regenerate AI Diet
        </button>
      </div>

      {/* Water Hydration Glass Bottle Tracker Stage */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950 border border-cyan-500/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-2xl relative overflow-hidden">
        {/* Animated Liquid Wave Water Bottle */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="w-28 h-48 rounded-3xl border-4 border-cyan-400/80 bg-slate-950/80 p-1 relative overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.4)]">
            <div className="w-full h-full rounded-2xl relative overflow-hidden bg-slate-900/60">
              {/* Liquid wave filling */}
              <div
                className="water-wave transition-all duration-700 ease-out"
                style={{ top: `${100 - waterPercent}%` }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white font-extrabold">
                <Droplet className="w-7 h-7 text-white animate-bounce drop-shadow" />
                <span className="text-2xl font-black font-heading mt-1 drop-shadow-md">{waterPercent}%</span>
                <span className="text-[10px] text-cyan-100 uppercase tracking-widest font-semibold">{diet.waterLoggedMl} ml</span>
              </div>
            </div>
          </div>
        </div>

        {/* Water Stat Info & Buttons */}
        <div className="md:col-span-2 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase">
            <Droplet className="w-3.5 h-3.5" /> Fluid Wave Hydration Tracker
          </div>

          <h4 className="text-xl font-extrabold text-white">Daily Hydration Target: {diet.waterTargetMl} ml</h4>
          <p className="text-xs text-slate-300">
            Optimal cellular hydration improves muscle protein synthesis, metabolic rate, and cognitive performance.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => logWater(250)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> +250 ml Glass
            </button>
            <button
              onClick={() => logWater(500)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" /> +500 ml Bottle
            </button>
          </div>
        </div>
      </div>

      {/* 6 Health Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">BMI Score</span>
          <span className="text-xl font-black text-cyan-400 mt-0.5 block">{metrics.bmi}</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 inline-block font-bold">
            {metrics.bmiCategory}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">BMR Base</span>
          <span className="text-xl font-black text-purple-400 mt-0.5 block">{metrics.bmr}</span>
          <span className="text-[9px] text-slate-400 block">kcal resting</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">TDEE Active</span>
          <span className="text-xl font-black text-amber-400 mt-0.5 block">{metrics.tdee}</span>
          <span className="text-[9px] text-slate-400 block">kcal total</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Goal Target</span>
          <span className="text-xl font-black text-emerald-400 mt-0.5 block">{metrics.dailyCaloriesTarget}</span>
          <span className="text-[9px] text-emerald-300 block capitalize font-bold">{user.goal.replace('_', ' ')}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Protein Target</span>
          <span className="text-xl font-black text-pink-400 mt-0.5 block">{metrics.proteinGrams}g</span>
          <span className="text-[9px] text-slate-400 block">High Anabolic</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Carb Limit</span>
          <span className="text-xl font-black text-blue-400 mt-0.5 block">{diet.carbsG}g</span>
          <span className="text-[9px] text-slate-400 block">Glycogen Rebound</span>
        </div>
      </div>

      {/* Regional Cuisine & Budget Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Cuisine Region</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="USA">USA / Western</option>
            <option value="India">India / South Asian</option>
            <option value="Japan">Japan / Asian Fusion</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Mexico">Latin America</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Diet Style</label>
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none"
          >
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto / Low Carb</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1 font-bold uppercase tracking-wider">Budget Tier</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none"
          >
            <option value="low">Budget Friendly</option>
            <option value="medium">Standard Balanced</option>
            <option value="high">Premium Gourmet</option>
          </select>
        </div>
      </div>

      {/* Meal Photography Cards */}
      <div className="space-y-4">
        <h4 className="text-lg font-extrabold text-white flex items-center gap-2 font-heading">
          <Sparkles className="w-5 h-5 text-emerald-400" /> Today&apos;s Neural Meal Script
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {diet.meals.map((meal, idx) => {
            const isExpanded = expandedRecipeIndex === idx;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="rounded-3xl glass-card border border-slate-800 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={mealImages[meal.type] || mealImages.breakfast}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-extrabold uppercase tracking-wider shadow">
                    {meal.type}
                  </span>
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs bg-slate-950/80 border border-slate-800 text-amber-400 font-extrabold">
                    {meal.calories} kcal
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h5 className="text-base font-extrabold text-white">{meal.name}</h5>

                  {/* Macro Progress Bars */}
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 block">Protein</span>
                      <span className="text-pink-400 font-black">{meal.proteinG}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 block">Carbs</span>
                      <span className="text-cyan-400 font-black">{meal.carbsG}g</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 block">Fat</span>
                      <span className="text-amber-400 font-black">{meal.fatG}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedRecipeIndex(isExpanded ? null : idx)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>{isExpanded ? 'Hide Recipe' : 'View Step-by-Step Recipe'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300"
                      >
                        <div className="flex items-center justify-between text-slate-400 font-semibold">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Prep Time: 15 mins</span>
                          <span className="text-emerald-400">Easy Execution</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400">
                          <strong>Ingredients:</strong> {meal.ingredients.join(', ')}.
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                          <li>Prepare and measure all whole food ingredients.</li>
                          <li>Cook on medium heat with minimal healthy oil (olive or coconut oil).</li>
                          <li>Season with herbs, turmeric, and sea salt to boost metabolic absorption.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expandable Shopping List */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-extrabold text-white flex items-center gap-2 font-heading">
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Interactive Smart Grocery Shopping List
          </h4>
          <span className="text-xs font-semibold text-slate-400">
            {checkedItems.length} of {diet.shoppingList.length} items completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {diet.shoppingList.map((item, idx) => {
            const isChecked = checkedItems.includes(item);
            return (
              <button
                key={idx}
                onClick={() => toggleShoppingItem(item)}
                className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 line-through opacity-75'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{item}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isChecked ? 'bg-emerald-400 text-slate-950' : 'border border-slate-700'}`}>
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
