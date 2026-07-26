'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFitStore } from '@/store/useFitStore';
import { REAL_MUSIC_DATABASE } from '@/lib/realMusicDatabase';
import { MusicTrack } from '@/types';
import { Music, Play, Pause, Search, Volume2, VolumeX, ListPlus, Sparkles } from 'lucide-react';

export const MusicPlayerExpanded: React.FC = () => {
  const { mood, currentTrack, setCurrentTrack } = useFitStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = currentTrack || REAL_MUSIC_DATABASE[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play notice:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSelectTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((err) => {
            console.warn('Track play notice:', err);
            setIsPlaying(false);
          });
      }
    }, 100);
  };

  const filteredTracks = REAL_MUSIC_DATABASE.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Hidden Audio Engine Element for Real Sound */}
      <audio
        ref={audioRef}
        src={activeTrack.audioUrl}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.warn('Handled audio stream load event:', e);
          setIsPlaying(false);
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-400" /> FitVerse Audio Engine & Music Module
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audible Web Audio player with personalized mood ({mood.toUpperCase()}) & country recommendations.
          </p>
        </div>

        {/* Search Bar (Song, Artist, Album, Playlist) */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search song, artist, album (e.g. Believer, Zinda)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
          />
        </div>
      </div>

      {/* Main Active Player Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-950 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={activeTrack.coverUrl}
            alt={activeTrack.title}
            className="w-20 h-20 rounded-2xl object-cover border border-purple-500/40 shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase mb-1">
              <Sparkles className="w-3 h-3" /> Playing • {activeTrack.genre} ({activeTrack.country})
            </div>
            <h4 className="text-lg font-bold text-white">{activeTrack.title}</h4>
            <p className="text-xs text-slate-400">{activeTrack.artist} • {activeTrack.album}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ListPlus className="w-4 h-4 text-purple-400" /> Real Music Library & Regional Track List
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTracks.map((track) => {
            const isSelected = track.id === activeTrack.id;
            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{track.title}</h5>
                    <p className="text-[11px] text-slate-400">{track.artist} ({track.genre})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-purple-300 font-semibold">
                    {track.duration}
                  </span>
                  <button className="p-1.5 rounded-full bg-purple-500/20 text-purple-300">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
