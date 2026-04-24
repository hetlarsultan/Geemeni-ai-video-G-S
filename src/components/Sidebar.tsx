import React from 'react';
import { Settings2, Camera, Zap, Layout, Monitor, Film, Mic2, Users, Dna, Globe, Mountain, Layers, Sparkles, UserCheck } from 'lucide-react';
import { VideoModel, ShotConfig } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  model: VideoModel;
  setModel: (model: VideoModel) => void;
  config: ShotConfig;
  setConfig: (config: ShotConfig) => void;
  view?: 'models' | 'actors' | 'env';
}

const MODELS: VideoModel[] = ['Sora 2', 'Kling v1.5', 'Veo 3.1', 'Luma Dream Machine', 'Runway Gen-3'];

export default function Sidebar({ model, setModel, config, setConfig, view }: SidebarProps) {
  const isMobile = !!view;

  return (
    <>
      {/* AI Model Suite */}
      {(!isMobile || view === 'models') && (
        <section className={`${!isMobile ? 'col-start-9 col-span-4 row-start-3 row-span-2' : ''} bento-card p-4 h-full`}>
          <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-3 flex items-center justify-between tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              Model_Suite.lib
            </span>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          </h3>
          <div className="space-y-1.5 overflow-y-auto pr-1">
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-[11px] transition-all border ${
                  model === m
                    ? 'bg-blue-600/10 border-blue-600/30 text-white shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                    : 'bg-zinc-950/20 border-zinc-800/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <span className="font-bold tracking-tight">{m}</span>
                <div className={`w-1 h-1 rounded-full ${model === m ? 'bg-blue-400' : 'bg-zinc-800'}`} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Casting List */}
      {(!isMobile || view === 'actors') && (
        <div className="space-y-4">
          <section className={`${!isMobile ? 'col-start-5 col-span-3 row-start-5 row-span-2' : ''} bento-card p-4 h-full`}>
            <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-4 flex items-center justify-between tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Casting_List.io
              </span>
              <span className="text-zinc-700 font-mono text-[8px]">ACTIVE_03</span>
            </h3>
            <div className="space-y-2">
               {[
                 { name: 'Elara_Prime', role: 'Protagonist', status: 'LOCKED' },
                 { name: 'Kaelen_Echo', role: 'Support', status: 'READY' },
                 { name: 'Shadow_Stalker', role: 'Antagonist', status: 'DRAFT' }
               ].map((actor, i) => (
                 <div key={i} className="p-2 bento-inner flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${actor.status === 'LOCKED' ? 'bg-blue-500' : actor.status === 'READY' ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                       <div>
                          <div className="text-[9px] font-bold text-zinc-300">{actor.name}</div>
                          <div className="text-[7px] text-zinc-600 uppercase tracking-tighter">{actor.role}</div>
                       </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-zinc-900 rounded">
                       <Dna className="w-2.5 h-2.5 text-zinc-400" />
                    </button>
                 </div>
               ))}
            </div>
          </section>

          {/* Character Consistency Module - Added for mobile version of actors view */}
          {isMobile && (
            <section className="bento-card p-4 group/char">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-4 flex items-center justify-between tracking-[0.2em]">
                <span className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  Character_Consistency
                </span>
                <span className="text-[7px] text-emerald-500/80 font-mono">STABLE_98.4%</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bento-inner bg-blue-600/5 relative overflow-hidden">
                   <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-blue-500/30 overflow-hidden shrink-0">
                      <img src="https://picsum.photos/seed/elara/120/120" className="w-full h-full object-cover" alt="Protagonist" referrerPolicy="no-referrer" />
                   </div>
                   <div className="min-w-0">
                     <div className="text-[11px] font-black text-white truncate">Elara_Prime</div>
                     <div className="text-[8px] text-blue-500 font-mono font-bold">UID: 0x9f22_77b</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   {['FACE', 'OUTFIT', 'MOOD', 'LIGHT'].map(trait => (
                     <div key={trait} className="p-2 bento-inner bg-black/40 flex justify-between items-center">
                        <span className="text-[8px] text-zinc-600 font-black tracking-widest">{trait}</span>
                        <span className="text-[9px] font-mono text-white">90%</span>
                     </div>
                   ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Audio Workspace */}
      {(!isMobile || view === 'actors') && (
        <section className={`${!isMobile ? 'col-start-8 col-span-2 row-start-5 row-span-2' : ''} bento-card p-4 h-full`}>
          <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-4 flex items-center justify-between tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <Mic2 className="w-3.5 h-3.5 text-blue-500" />
              Vocal_Matrix
            </span>
            <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1 border border-blue-500/20 rounded">MULTI_TRACK</span>
          </h3>
          <div className="space-y-3">
            <div className="space-y-2 max-h-[85px] overflow-y-auto pr-1">
               {[
                 { id: 'actor_1', name: 'Elara', voice: 'Antoni', sync: 98 },
                 { id: 'actor_2', name: 'Kaelen', voice: 'Rachel', sync: 92 },
                 { id: 'actor_3', name: 'Shadow', voice: 'Marcus', sync: 0 }
               ].map((v) => (
                 <div key={v.id} className="p-1.5 bento-inner bg-black/40 flex flex-col gap-1 hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-center text-[8px] font-mono">
                       <span className="text-zinc-300 font-bold">{v.name} &gt; {v.voice}</span>
                       <span className={v.sync > 0 ? 'text-blue-500' : 'text-zinc-700'}>{v.sync}%</span>
                    </div>
                    <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${v.sync > 0 ? 'bg-blue-600' : 'bg-transparent'}`} style={{ width: `${v.sync}%` }} />
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex items-center justify-between px-1">
               <span className="text-[8px] text-zinc-600 font-bold uppercase">Auto-Sync With Video</span>
               <div className="w-6 h-3 bg-blue-600/20 rounded-full relative cursor-pointer border border-blue-600/30">
                  <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-blue-500 rounded-full" />
               </div>
            </div>
            <button className="w-full py-1.5 bento-inner text-[8px] uppercase font-black text-blue-400 border-blue-600/20 bg-blue-600/5 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-900/10">
               Sync_All_Mouths
            </button>
          </div>
        </section>
      )}

      {/* World Synthesis - Only in environment view on mobile */}
      {view === 'env' && (
        <section className="bento-card p-4 h-full flex flex-col group/env">
          <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-3 flex items-center justify-between tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <Mountain className="w-3.5 h-3.5 text-blue-500 group-hover/env:rotate-12 transition-transform" />
              World_Synthesis.vfx
            </span>
            <div className="flex gap-1">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <div className="w-2 h-2 bg-blue-500/30 rounded-full" />
            </div>
          </h3>
          <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar">
             <div className="p-3 bento-inner bg-blue-600/5 border-blue-600/20 relative overflow-hidden group/biome">
                <div className="text-[11px] text-blue-400 font-bold mb-2 flex justify-between items-center">
                   <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Biome: Dynamic_Cyber</span>
                   <span className="text-[8px] text-emerald-500 animate-pulse bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20">LIVE</span>
                </div>
                <div className="h-1.5 w-full bg-blue-900/30 overflow-hidden rounded-full mb-3">
                   <motion.div 
                     animate={{ x: ['-100%', '100%'] }}
                     transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                     className="h-full bg-blue-500 w-1/3 blur-sm" 
                   />
                </div>
                <div className="flex justify-between items-center text-[8px] text-zinc-500 font-mono">
                   <span>RES: 4K_GEN</span>
                   <span>TICKS: 240FPS_SIM</span>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                   <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Anim_Intensity</span>
                   <span className="text-[9px] text-blue-400 font-mono">0.85x</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                   <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 w-[85%]" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bento-inner text-[9px] uppercase font-black text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-all bg-black/40 flex flex-col items-center gap-2 group/btn">
                   <Layers className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                   Volumetrics
                </button>
                <button className="p-3 bento-inner text-[9px] uppercase font-black text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all bg-black/40 flex flex-col items-center gap-2 group/btn">
                   <Sparkles className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                   Particle_Gen
                </button>
             </div>

             <div className="p-3 bento-inner flex justify-between items-center text-[10px] font-mono bg-emerald-500/5 border-emerald-500/10">
                <span className="text-emerald-500/80 flex items-center gap-2 font-black">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                   ATMOSPHERIC_ENGINE
                </span>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative cursor-pointer border border-emerald-500/30">
                   <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
             </div>
          </div>
        </section>
      )}
    </>
  );
}
