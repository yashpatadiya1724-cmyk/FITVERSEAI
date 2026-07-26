'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFitStore } from '@/store/useFitStore';
import { askGroqAICoach } from '@/lib/aiService';
import { Bot, Send, User, Sparkles, Zap, Mic, Volume2, Flame, Heart, Activity } from 'lucide-react';
import { ChatMessage } from '@/types';

export const AICoachChat: React.FC = () => {
  const { user, chatHistory, sendChatMessage, mood } = useFitStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getOrbStyle = () => {
    switch (mood) {
      case 'happy':
        return { bg: 'from-amber-400 via-orange-500 to-yellow-300', shadow: 'rgba(245, 158, 11, 0.6)', label: 'Energetic Mode' };
      case 'tired':
        return { bg: 'from-emerald-400 via-teal-500 to-cyan-300', shadow: 'rgba(34, 197, 94, 0.6)', label: 'Calm Recovery' };
      case 'lazy':
        return { bg: 'from-rose-500 via-red-600 to-amber-500', shadow: 'rgba(239, 68, 68, 0.6)', label: 'Beast Beast Mode' };
      case 'sad':
        return { bg: 'from-purple-500 via-indigo-600 to-cyan-400', shadow: 'rgba(139, 92, 246, 0.6)', label: 'Focus Chill' };
      default:
        return { bg: 'from-cyan-400 via-blue-600 to-purple-600', shadow: 'rgba(0, 229, 255, 0.6)', label: 'Neural Optimal' };
    }
  };

  const orbInfo = getOrbStyle();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const finalMsg = textToSend || input;
    if (!finalMsg.trim() || isTyping) return;

    if (!textToSend) setInput('');
    sendChatMessage(finalMsg);
    setIsTyping(true);

    try {
      const userContext = `User: ${user.fullName || user.username}, Goal: ${user.goal}, Level: ${user.level}, Streak: ${user.streakDays} days, Mood: ${mood}`;
      const aiReplyText = await askGroqAICoach(finalMsg, userContext);
      
      useFitStore.setState((state) => ({
        chatHistory: [
          ...state.chatHistory,
          {
            id: Date.now().toString(),
            sender: 'ai',
            text: aiReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));

      speakText(aiReplyText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    '🔥 Optimize today\'s workout intensity',
    '💧 Check hydration & muscle recovery',
    '🥗 High protein dinner recipe idea',
    '⚡ Give me an Iron Man hype talk!',
  ];

  return (
    <div className="glass-card p-6 flex flex-col h-[650px] relative overflow-hidden border border-cyan-500/30">
      {/* Top JARVIS Orb Hero Stage */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-slate-800 shrink-0 gap-4">
        <div className="flex items-center gap-4">
          {/* Breathing Orb */}
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-tr ${orbInfo.bg} jarvis-orb ${
                isSpeaking || isTyping ? 'speaking' : ''
              } flex items-center justify-center text-slate-950 font-bold shadow-2xl transition-all duration-500`}
            >
              <Bot className="w-7 h-7 text-slate-950 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-heading">
              J.A.R.V.I.S Neural Assistant
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase border border-cyan-500/40">
                v4.8 Quantum
              </span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              State: <span className="text-cyan-300 font-semibold">{orbInfo.label}</span>
            </p>
          </div>
        </div>

        {/* Audio Waveform visualizer indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 h-6 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <div className="flex items-end gap-0.5 h-4">
              <div className={`w-1 bg-cyan-400 rounded-full eq-bar ${isSpeaking ? 'h-full' : 'h-2'}`} />
              <div className={`w-1 bg-purple-400 rounded-full eq-bar ${isSpeaking ? 'h-full' : 'h-3'}`} style={{ animationDelay: '0.2s' }} />
              <div className={`w-1 bg-emerald-400 rounded-full eq-bar ${isSpeaking ? 'h-full' : 'h-1'}`} style={{ animationDelay: '0.4s' }} />
              <div className={`w-1 bg-amber-400 rounded-full eq-bar ${isSpeaking ? 'h-full' : 'h-2.5'}`} style={{ animationDelay: '0.1s' }} />
            </div>
          </div>

          <button
            onClick={() => speakText("FitVerse AI Assistant online and ready for your fitness optimization.")}
            className="p-2 rounded-full glass-card border border-cyan-500/30 text-cyan-300 hover:text-white transition-all cursor-pointer"
            title="Voice Test"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-800/60 shrink-0">
        {suggestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold glass-card-sm text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 scrollbar-thin">
        {chatHistory.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white shadow-purple-500/20'
                  : `bg-gradient-to-tr ${orbInfo.bg} text-slate-950 shadow-cyan-500/20`
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[82%] text-xs sm:text-sm leading-relaxed transition-all ${
                msg.sender === 'user'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 rounded-tr-none shadow-md'
                  : 'bg-slate-900/90 text-slate-100 border border-slate-800/90 rounded-tl-none shadow-lg'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[9px] text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Sparkles className="w-3 h-3" /> AI Voice Ready
                </span>
                <span>{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 font-semibold animate-pulse">
            <Zap className="w-4 h-4 animate-spin text-cyan-400" />
            <span>JARVIS is synthesizing metabolic feedback...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="pt-3 border-t border-slate-800 shrink-0 flex gap-2">
        <input
          type="text"
          placeholder="Command JARVIS AI (e.g., 'Lower my rest time to 45s', 'Create high protein diet')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isTyping}
          className="px-5 py-3 rounded-2xl cyber-btn text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:scale-105 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};

