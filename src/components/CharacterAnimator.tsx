import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, ShotConfig } from '../types';
import { Activity, Clock, MapPin, Zap, Box, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Avatar3D } from './Avatar3D';

interface CharacterAnimatorProps {
  character: Character;
  lipSyncLevel: number;
  config: ShotConfig;
}

const ENVIRONMENTS = {
  desert: {
    bg: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=1200',
    overlay: 'bg-orange-950/20',
    lighting: 'bg-gradient-to-t from-orange-500/10 to-transparent',
    particles: 'animate-sand-drift'
  },
  city: {
    bg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    overlay: 'bg-blue-950/30',
    lighting: 'bg-gradient-to-t from-blue-500/10 to-transparent',
    particles: 'animate-pulse'
  },
  house: {
    bg: 'https://images.unsplash.com/photo-1600585154340-be6199fbfd0b?auto=format&fit=crop&q=80&w=1200',
    overlay: 'bg-zinc-950/30',
    lighting: 'bg-gradient-to-t from-zinc-500/10 to-transparent',
    particles: 'hidden'
  },
  mosque: {
    bg: 'https://images.unsplash.com/photo-1542661596-f6424564c781?auto=format&fit=crop&q=80&w=1200',
    overlay: 'bg-emerald-950/20',
    lighting: 'bg-gradient-to-t from-emerald-500/10 to-transparent',
    particles: 'animate-gentle-dust'
  },
  studio: {
    bg: 'https://images.unsplash.com/photo-1524169220946-12efd782aab4?auto=format&fit=crop&q=80&w=1200',
    overlay: 'bg-black/60',
    lighting: 'bg-gradient-to-t from-blue-600/20 to-transparent',
    particles: 'animate-digital-scan'
  }
};

export const CharacterAnimator: React.FC<CharacterAnimatorProps> = ({
  character,
  lipSyncLevel,
  config
}) => {
  const [blink, setBlink] = useState(false);
  const [is3D, setIs3D] = useState(character.style === '3d-animation' || !!character.vrmUrl);
  const [isSadTalkerGenerating, setIsSadTalkerGenerating] = useState(false);
  const [sadTalkerVideo, setSadTalkerVideo] = useState<string | null>(null);
  const currentEnv = ENVIRONMENTS[config.environment as keyof typeof ENVIRONMENTS] || ENVIRONMENTS.studio;

  const handleSadTalkerRender = async () => {
    setIsSadTalkerGenerating(true);
    try {
      const response = await fetch('/api/generate-talking-head', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePath: character.avatar,
          audioPath: 'voice.wav', // Simulated
          characterId: character.id
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSadTalkerVideo(data.videoUrl);
      }
    } catch (error) {
      console.error("SadTalker Render Error:", error);
    } finally {
      setIsSadTalkerGenerating(false);
    }
  };

  // Auto-blinking logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 3000 + 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center group">
      {is3D ? (
        <Avatar3D 
          modelUrl={character.vrmUrl || character.glbUrl} 
          lipSyncLevel={lipSyncLevel} 
          emotion={config.emotion || 'neutral'}
        />
      ) : sadTalkerVideo ? (
        <div className="relative w-full h-full">
           <video 
             src={sadTalkerVideo} 
             autoPlay 
             loop 
             muted={lipSyncLevel === 0}
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
           <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">SadTalker_Neural_Output</span>
           </div>
           <button 
             onClick={() => setSadTalkerVideo(null)}
             className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/80 hover:bg-zinc-800 px-4 py-2 rounded-full text-[10px] font-black uppercase text-zinc-400 border border-zinc-800/50 backdrop-blur-md transition-all pointer-events-auto"
           >
             Exit Neural Render
           </button>
        </div>
      ) : (
        <>
          {/* Dynamic Background */}
          <motion.div 
            key={config.environment}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={currentEnv.bg} 
              className="w-full h-full object-cover grayscale-[0.2] brightness-[0.4]"
              alt="Environment"
            />
            <div className={`absolute inset-0 ${currentEnv.overlay}`} />
            <div className={`absolute inset-0 ${currentEnv.lighting}`} />
          </motion.div>

          {/* Atmospheric Particles */}
          <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-30 ${currentEnv.particles}`}>
            {currentEnv.particles !== 'hidden' && [...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white/20 rounded-full blur-[1px]"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 10 + 's',
                }}
              />
            ))}
          </div>

          {/* Main Character Body Container */}
          <motion.div 
            animate={{
              y: [0, -3, 0],
              rotate: [0, 0.5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-20 flex flex-col items-center"
          >
            {/* Head & Face */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64">
              <motion.div 
                animate={{
                  scale: 1 + lipSyncLevel * 0.02,
                  scaleY: 1 + (lipSyncLevel > 0 ? (Math.sin(Date.now() / 50) * 0.02) : 0),
                  y: lipSyncLevel * 3,
                  filter: `brightness(${1 + lipSyncLevel * 0.15})`,
                }}
                className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500/20 shadow-[0_0_80px_rgba(37,99,235,0.2)] bg-black"
              >
                <img 
                  src={character.avatar}
                  className="w-full h-full object-cover opacity-85"
                  alt={character.name}
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Neural Lip Sync Module - Enhanced for Production */}
              <div className="absolute bottom-[23%] left-1/2 -translate-x-1/2 w-24 h-12 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{
                      scaleY: lipSyncLevel * 4.2 + 0.05,
                      scaleX: 1 + lipSyncLevel * 0.35,
                      opacity: lipSyncLevel > 0.02 ? 1 : 0,
                      filter: `blur(${lipSyncLevel > 0.5 ? '1px' : '0.4px'})`
                    }}
                    className="w-16 h-7 bg-zinc-950 rounded-[50%] border-b-2 border-rose-600/30 shadow-[0_8px_20px_rgba(0,0,0,0.9)] overflow-hidden relative"
                  >
                    {/* Upper Teeth Area */}
                    <motion.div
                      animate={{
                        y: lipSyncLevel * -2.5,
                        opacity: lipSyncLevel > 0.1 ? 0.95 : 0,
                      }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-gradient-to-b from-white via-zinc-100 to-zinc-300 rounded-b-lg blur-[0.2px] z-20 border-x border-zinc-400/20 shadow-inner"
                    />
                    
                    {/* Inner Throat Glow */}
                    <motion.div
                      animate={{
                        opacity: lipSyncLevel > 0.25 ? 0.8 : 0,
                        scale: 0.7 + lipSyncLevel * 0.4
                      }}
                      className="absolute inset-0 bg-gradient-to-b from-rose-950 to-black rounded-full blur-[3px] z-10"
                    />

                    {/* Tongue/Lower Mouth Details */}
                    <motion.div
                      animate={{
                        y: lipSyncLevel * 2,
                        opacity: lipSyncLevel > 0.4 ? 0.6 : 0,
                        scaleX: 0.9 + lipSyncLevel * 0.1
                      }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 bg-rose-900/60 rounded-t-full blur-[1px] z-20 shadow-[0_-2px_10px_rgba(225,29,72,0.2)]"
                    />
                  </motion.div>

                  {/* Feature Label Overlay */}
                  <AnimatePresence>
                    {lipSyncLevel > 0.05 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -bottom-8 bg-blue-600/20 backdrop-blur-md px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1.5"
                      >
                         <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                         <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest whitespace-nowrap">Neural_Lip_Sync_v4</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Indicator Pulse */}
                  <AnimatePresence>
                    {lipSyncLevel > 0.1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.3, 1] }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl -z-10"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Eye Blinking */}
              <div className="absolute top-[35%] left-0 w-full px-[15%] flex justify-between">
                <motion.div 
                  animate={{ scaleY: blink ? 0.1 : 1 }}
                  className="w-8 h-4 bg-black/60 rounded-full blur-[0.5px]"
                />
                <motion.div 
                  animate={{ scaleY: blink ? 0.1 : 1 }}
                  className="w-8 h-4 bg-black/60 rounded-full blur-[0.5px]"
                />
              </div>

              <motion.div 
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-x-[-10%] inset-y-[-10%] rounded-full border border-blue-500/20 -z-10 blur-xl"
              />
            </div>
          </motion.div>
        </>
      )}

      {/* Shared Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
           <div className="flex flex-col gap-2 pointer-events-auto">
             <div className="flex gap-1.5 items-center">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
               <div className="text-[9px] font-black text-zinc-500 font-mono">REC_MODE: {is3D ? 'NEURAL_3D' : 'LIVE_SYNC'}</div>
             </div>
             
             {/* Toggle 2D/3D */}
             <button 
                onClick={() => setIs3D(!is3D)}
                className="flex items-center gap-2 px-3 py-1 bg-black/60 hover:bg-black/80 rounded-full border border-white/10 transition-all group"
             >
                {is3D ? <ImageIcon className="w-3 h-3 text-zinc-400" /> : <Box className="w-3 h-3 text-blue-500" />}
                <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-tighter">
                  Switch to {is3D ? '2D Cinematic' : 'Hyper-3D'}
                </span>
             </button>

             {!is3D && (
               <button 
                 onClick={handleSadTalkerRender}
                 disabled={isSadTalkerGenerating}
                 className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 rounded-full border border-blue-500/30 transition-all group disabled:opacity-50 pointer-events-auto"
               >
                 {isSadTalkerGenerating ? (
                   <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                 ) : (
                   <Sparkles className="w-3 h-3 text-blue-400 group-hover:rotate-12 transition-transform" />
                 )}
                 <span className="text-[8px] font-bold text-blue-300 uppercase tracking-tighter">
                   {isSadTalkerGenerating ? 'Rendering...' : 'SadTalker Neural Render'}
                 </span>
               </button>
             )}
           </div>
           
           <div className="text-[8px] font-mono text-zinc-500 flex items-center gap-2 bg-black/40 px-2 py-1 rounded">
             <Clock className="w-2 h-2" />
             {new Date().toLocaleTimeString()}
           </div>
        </div>

        <div className="flex justify-between items-end">
           <div className="space-y-1">
              <div className="text-[7px] font-mono text-blue-500 uppercase">Latency_Optimized</div>
              <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: lipSyncLevel > 0 ? ['40%', '60%', '50%'] : '20%' }}
                  className="h-full bg-blue-500"
                />
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[8px] font-mono text-white tracking-widest uppercase">{character.name}</div>
                <div className="text-[7px] font-mono text-zinc-500">VOICE_NODE_ACTIVE</div>
              </div>
              <div className="w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-black/50">
                 <Zap className={`w-3.5 h-3.5 transition-all ${lipSyncLevel > 0.5 ? 'text-yellow-400 scale-125' : 'text-blue-500'}`} fill="currentColor" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
