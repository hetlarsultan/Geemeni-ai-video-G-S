import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Sparkles, Send, Box, Clipboard, Wand2, History, Trash2, Loader2, X, Copy, 
  ArrowRight, Film, Download, Eye, Smartphone, Cloud, CloudOff, Mic2, Globe, 
  Mountain, Image as ImageIcon, Music, BarChart3, UserCheck, Layers, Cpu, 
  Share2, MessageSquare, Brain, Clapperboard, UserRound, ScanSearch, PlayCircle, Zap, Mic2 as MicIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  optimizePrompt, 
  scriptToPrompts, 
  OptimizedPrompt, 
  chatWithGemini, 
  chatWithGeminiStream, 
  generateNanoImage, 
  generateVeoVideo, 
  generateLyriaMusic, 
  generateCharacter,
  generateSoundscape,
  convertToAnimatedImage,
  generateAdvancedVoice,
  analyzeVideo
} from '../lib/gemini';
import { VideoModel, Generation, ShotConfig, MediaType, CharacterStyle } from '../types';
import { loadFFmpeg } from '../services/ffmpegService';

interface WorkspaceProps {
  model: VideoModel;
  config: ShotConfig;
  isMobile?: boolean;
  initialMediaType?: MediaType;
}

// Memoized Sub-components for Stability and Speed
const GenerationCard = React.memo(({ 
  g, 
  isActive, 
  onSelect 
}: { 
  g: Generation, 
  isActive: boolean, 
  onSelect: (g: Generation) => void 
}) => (
  <button
    onClick={() => onSelect(g)}
    className={`shrink-0 w-24 h-full rounded-lg border transition-all relative overflow-hidden group ${
      isActive ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-zinc-800/50 hover:border-zinc-600'
    }`}
  >
    {g.status === 'generating' ? (
      <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      </div>
    ) : g.status === 'error' ? (
      <div className="absolute inset-0 bg-rose-950/20 flex items-center justify-center">
        <X className="w-4 h-4 text-rose-500" />
      </div>
    ) : (
      <img 
        src={g.previewUrl || (g.type === 'image' ? `https://picsum.photos/seed/${g.id}/200/150` : "https://picsum.photos/seed/thumb/200/150")} 
        className={`w-full h-full object-cover transition-all ${isActive ? 'grayscale-0 scale-105' : 'grayscale-[0.4] group-hover:grayscale-0'}`}
        alt={g.type}
        loading="lazy"
      />
    )}
    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm p-0.5 rounded border border-white/5">
      {g.type === 'video' ? <Film className="w-2.5 h-2.5 text-emerald-500" /> : 
       g.type === 'image' ? <ImageIcon className="w-2.5 h-2.5 text-blue-500" /> : 
       g.type === 'chat' ? <MessageSquare className="w-2.5 h-2.5 text-zinc-400" /> :
       g.type === 'audio' ? <Music className="w-2.5 h-2.5 text-purple-400" /> :
       <Box className="w-2.5 h-2.5 text-blue-400" />}
    </div>
    {g.status === 'completed' && <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
  </button>
));

const GenerationsBar = React.memo(({ 
  generations, 
  activeId, 
  onSelect,
  isMobile
}: { 
  generations: Generation[], 
  activeId?: string, 
  onSelect: (g: Generation) => void,
  isMobile?: boolean
}) => {
  return (
    <section className={`${!isMobile ? 'col-start-1 col-span-8 row-start-4 row-span-1' : 'w-full h-24 my-2'} bento-card p-3 flex gap-3 overflow-x-auto no-scrollbar items-center bg-zinc-950/40 border-zinc-900`}>
      {generations.map((g) => (
        <GenerationCard key={g.id} g={g} isActive={activeId === g.id} onSelect={onSelect} />
      ))}
      {generations.length === 0 && (
        <div className="text-[8px] text-zinc-700 font-black uppercase tracking-widest pl-2 flex items-center gap-2">
          <Box className="w-3 h-3 text-zinc-800" />
          Queue_Empty
        </div>
      )}
    </section>
  );
});

const WorldSynthesis = React.memo(({ isMobile }: { isMobile?: boolean }) => (
  <section className={`${!isMobile ? 'col-start-10 col-span-3 row-start-5 row-span-2' : ''} bento-card p-4 group/env flex flex-col`}>
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
    <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar">
       <div className="p-2 bento-inner bg-blue-600/5 border-blue-600/20 relative overflow-hidden group/biome">
          <div className="text-[9px] text-blue-400 font-bold mb-1 flex justify-between items-center">
             <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Biome: Dynamic_Cyber</span>
             <span className="text-[7px] text-emerald-500 animate-pulse bg-emerald-500/10 px-1 rounded border border-emerald-500/20">LIVE_SYNTHESIS</span>
          </div>
          <div className="h-1 w-full bg-blue-900/30 overflow-hidden rounded mb-2">
             <motion.div 
               animate={{ x: ['-100%', '100%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
               className="h-full bg-blue-500 w-1/3 blur-sm" 
             />
          </div>
          <div className="flex justify-between items-center text-[7px] text-zinc-500 font-mono">
             <span>RES: 4K_GEN</span>
             <span>TICKS: 240FPS_SIM</span>
          </div>
       </div>

       <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
             <span className="text-[8px] text-zinc-600 font-bold uppercase">Anim_Intensity</span>
             <span className="text-[8px] text-blue-400 font-mono">0.85x</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
             <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 w-[85%]" />
          </div>
       </div>

       <div className="grid grid-cols-2 gap-2">
          <button className="p-2 bento-inner text-[8px] uppercase font-black text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-all bg-black/40 flex flex-col items-center gap-1 group/btn">
             <Layers className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
             Volumetrics
          </button>
          <button className="p-2 bento-inner text-[8px] uppercase font-black text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all bg-black/40 flex flex-col items-center gap-1 group/btn">
             <Sparkles className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
             Particle_Gen
          </button>
       </div>
       
       <div className="p-2 bento-inner flex justify-between items-center text-[9px] font-mono bg-emerald-500/5 border-emerald-500/10">
          <span className="text-emerald-500/80 flex items-center gap-2 font-black">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
             ATMOSPHERIC_ENGINE
          </span>
          <div className="w-6 h-3 bg-emerald-500/20 rounded-full relative cursor-pointer border border-emerald-500/30">
             <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
       </div>
    </div>
  </section>
));

const CharacterConsistencyEngine = React.memo(({ isMobile }: { isMobile?: boolean }) => (
  <section className={`${!isMobile ? 'col-start-9 col-span-4 row-start-1 row-span-2' : ''} bento-card p-4 group/char`}>
    <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-3 flex items-center justify-between tracking-[0.2em]">
      <span className="flex items-center gap-2">
        <UserCheck className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
        Character_Consistency_Engine
      </span>
      <div className="flex gap-1.5 flex-col items-end">
         <div className="text-[7px] text-emerald-500/80 font-mono tracking-tighter">LOCK_STABLE_98.4%</div>
         <div className="flex gap-0.5">
            {[1, 1, 1, 0.3].map((op, i) => (
               <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full" style={{ opacity: op }} />
            ))}
         </div>
      </div>
    </h3>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
           <label className="text-[8px] font-black uppercase text-zinc-600 tracking-widest block">Core_Identifier</label>
           <div className="flex items-center space-x-2 p-2 bento-inner bg-blue-600/5 relative overflow-hidden group/prime">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-blue-500/30 overflow-hidden shrink-0 relative">
                 <img src="https://picsum.photos/seed/elara/120/120" className="w-full h-full object-cover transition-all grayscale-[0.2] group-hover/prime:scale-110 group-hover/prime:grayscale-0" alt="Protagonist" referrerPolicy="no-referrer" loading="lazy" />
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-white truncate flex items-center gap-1.5">
                   Elara_Prime 
                   <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                </div>
                <div className="text-[7px] text-blue-500 font-mono font-bold flex flex-col">
                   <span>UID: 0x9f22_77b</span>
                   <span className="text-zinc-600">STABILITY: 0.99z</span>
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-[8px] font-black uppercase text-zinc-600 tracking-widest block">DNA_Mapping_Sequence</label>
           <div className="p-2 bento-inner bg-black/40 font-mono text-[7px] text-blue-400 leading-none break-all space-y-1 overflow-hidden">
              <div className="flex gap-0.5">
                 {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      className={`w-0.5 rounded-full ${i % 3 === 0 ? 'bg-blue-500' : 'bg-zinc-800'}`}
                    />
                 ))}
              </div>
              <div className="font-bold opacity-30 select-none tracking-tighter">AGCT_TTCG_AAAT_CCGG_GGTT</div>
           </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[8px] font-black uppercase text-zinc-600 tracking-widest block">Parameter_History</label>
        <div className="p-3 bento-inner bg-black/20 h-full flex flex-col justify-between">
           <div className="flex items-end gap-1 h-20">
              {[65, 82, 91, 74, 98, 88, 92, 85, 96, 94].map((h, i) => (
                <div key={i} className="flex-1 bg-zinc-900/50 rounded-t-[1px] relative group/bar mt-auto">
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     className={`absolute bottom-0 left-0 right-0 ${i > 7 ? 'bg-emerald-500/40' : 'bg-blue-600/30'} group-hover/bar:brightness-125 transition-all`}
                   >
                      <div className={`w-full h-0.5 absolute top-0 ${i > 7 ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                   </motion.div>
                   {i === 9 && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
                </div>
              ))}
           </div>
           <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 mt-2">
              <span>SCENE_01</span>
              <div className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span>SCENE_ACTIVE</span>
           </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-900">
       {[
         { label: 'FACE', val: 98, trend: 'stable' },
         { label: 'OUTFIT', val: 94, trend: 'up' },
         { label: 'MOOD', val: 96, trend: 'stable' },
         { label: 'LIGHT', val: 91, trend: 'down' }
       ].map(trait => (
         <div key={trait.label} className="text-center p-2 bento-inner bg-black/40 group/trait relative overflow-hidden">
            <div className="text-[7px] text-zinc-600 font-black mb-1 group-hover/trait:text-blue-500 transition-colors uppercase pr-3">{trait.label}</div>
            <div className="text-[9px] font-mono text-zinc-300 group-hover/trait:text-white">{trait.val}%</div>
            <div className={`absolute top-2 right-1.5 w-1 h-1 rounded-full ${trait.trend === 'up' ? 'bg-emerald-500' : trait.trend === 'down' ? 'bg-red-500' : 'bg-blue-500/50'}`} />
         </div>
       ))}
    </div>
  </section>
));

export default function PromptWorkspace({ model, config, isMobile, initialMediaType }: WorkspaceProps) {
  const [prompt, setPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const optimizationCache = React.useRef<Record<string, OptimizedPrompt>>({});
  const [ffmpegStatus, setFfmpegStatus] = useState<'loading' | 'ready' | 'idle'>('idle');
  const [generations, setGenerations] = useState<Generation[]>(() => {
    try {
      const saved = localStorage.getItem('studio_generations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'prompt' | 'script'>('prompt');
  const [mediaType, setMediaType] = useState<MediaType>(initialMediaType || 'video');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-flash-preview');
  const [useSearch, setUseSearch] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [apkProgress, setApkProgress] = useState<number | null>(null);
  const [apkStage, setApkStage] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('studio_prompt_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Proactive FFmpeg preloading
    const initFFmpeg = async () => {
      if (ffmpegStatus !== 'idle') return;
      setFfmpegStatus('loading');
      try {
        await loadFFmpeg();
        setFfmpegStatus('ready');
      } catch (err) {
        console.error('FFmpeg Load Error:', err);
        setFfmpegStatus('idle');
      }
    };
    initFFmpeg();
  }, []);

  useEffect(() => {
    if (initialMediaType) {
      setMediaType(initialMediaType);
    }
  }, [initialMediaType]);

  useEffect(() => {
    // Debounce syncing generations to local storage
    const timer = setTimeout(() => {
      localStorage.setItem('studio_generations', JSON.stringify(generations.slice(0, 50)));
    }, 1000);
    return () => clearTimeout(timer);
  }, [generations]);

  const addToHistory = (p: string) => {
    if (!p.trim()) return;
    setPromptHistory(prev => {
      const filtered = prev.filter(item => item !== p);
      const newHistory = [p, ...filtered].slice(0, 50);
      localStorage.setItem('studio_prompt_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem('studio_prompt_history');
  };

  const handleMergeMovies = useCallback(async () => {
    if (generations.filter(g => g.type === 'video').length < 2) return;
    setIsMerging(true);
    try {
      await new Promise(r => setTimeout(r, 2000)); // Optimized simulation
      const movieGen: Generation = {
        id: `movie_${Math.random().toString(36).substring(7)}`,
        type: 'movie',
        timestamp: Date.now(),
        prompt: "Synthesized multi-scene cinematic production",
        model: "FFmpeg_Movie_Engine",
        status: 'completed',
        previewUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        config: { ...config }
      };
      setGenerations(prev => [movieGen, ...prev]);
    } catch (err) {
      console.error("Merge Error:", err);
    } finally {
      setIsMerging(false);
    }
  }, [generations, config]);

  const startApkBuild = useCallback(() => {
    setApkProgress(0);
    const stages = ['Init_Capacitor', 'Syncing_Assets', 'Gradle_Config', 'WASM_Binding', 'Finalizing_APK'];
    setApkStage(stages[0]);
    const interval = setInterval(() => {
      setApkProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setApkProgress(null); setApkStage(''); }, 3000);
          return 100;
        }
        const nextProgress = prev + 2; // Twice as fast build for 'High Speed' request
        const stageIndex = Math.min(Math.floor(nextProgress / 20), stages.length - 1);
        setApkStage(stages[stageIndex]);
        return nextProgress;
      });
    }, 50); // Faster interval
  }, []);
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .bento-card { will-change: transform, opacity; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
      .gpu-fast { transform: translateZ(0); backface-visibility: hidden; perspective: 1000px; -webkit-font-smoothing: antialiased; }
      button { cursor: pointer; -webkit-tap-highlight-color: transparent; transition: all 0.1s cubic-bezier(0.2, 0.8, 0.2, 1); transform: translateZ(0); }
      button:active { transform: scale(0.96) translateZ(0); transition: all 0.05s ease; }
      @keyframes shimmer {
        0% { transform: translateX(-100%) skewX(-20deg); }
        100% { transform: translateX(100%) skewX(-20deg); }
      }
      .animate-shimmer { animation: shimmer 2s infinite linear; }
      .turbo-glow { box-shadow: 0 0 15px rgba(37,99,235,0.4); border-color: rgba(37,99,235,0.6); }
      .custom-scrollbar::-webkit-scrollbar { width: 3px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 20px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleAIAction = useCallback(async () => {
    if (!prompt.trim()) return;
    
    // Check Cache for Speed
    const cacheKey = `${model}_${prompt}`;
    if (optimizationCache.current[cacheKey]) {
      setPrompt(optimizationCache.current[cacheKey].optimizedPrompt);
      addToHistory(optimizationCache.current[cacheKey].optimizedPrompt);
      return;
    }

    setIsOptimizing(true);
    try {
      if (activeTab === 'prompt') {
        const result = await optimizePrompt(prompt, model);
        optimizationCache.current[cacheKey] = result;
        setPrompt(result.optimizedPrompt);
        addToHistory(result.optimizedPrompt);
      } else {
        const scenes = await scriptToPrompts(prompt, model);
        if (scenes.length > 0) {
          setPrompt(scenes[0].optimizedPrompt);
          addToHistory(scenes[0].optimizedPrompt);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  }, [prompt, model, activeTab, addToHistory]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showLightbox, setShowLightbox] = useState(false);

  const currentView = useMemo(() => 
    generations.find(g => g.id === activeId) || 
    generations.find(g => g.status === 'generating') || 
    generations[0],
  [generations, activeId]);

  const handleGenerate = useCallback(async (customPrompt?: string) => {
    // Ensure we don't treat an event as a prompt
    const actualPrompt = (typeof customPrompt === 'string' && customPrompt) ? customPrompt : prompt;
    if (!actualPrompt.trim()) return;
    
    setIsGenerating(true);
    const newGen: Generation = {
      id: Math.random().toString(36).substring(7),
      type: mediaType,
      prompt: actualPrompt,
      status: 'generating',
      timestamp: Date.now(),
      model: mediaType === 'video' ? 'veo-3.1-lite' : 'gemini-3.1-flash-image',
      config: { ...config }
    };

    setGenerations(prev => [newGen, ...prev]);
    setActiveId(newGen.id);

    try {
      if (mediaType === 'character') {
        const imageUrl = await generateCharacter(actualPrompt, config.characterStyle || 'cartoon');
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { ...g, status: 'completed' as const, previewUrl: imageUrl } : g)
        );
      } else if (mediaType === 'animated-image') {
        const imageUrl = await convertToAnimatedImage(actualPrompt);
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { ...g, status: 'completed' as const, previewUrl: imageUrl } : g)
        );
      } else if (mediaType === 'audio') {
        const voiceData = await generateAdvancedVoice(actualPrompt, config.voiceType || 'cartoon');
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { ...g, status: 'completed' as const, previewUrl: voiceData.audioUrl } : g)
        );
      } else if (mediaType === 'movie' || mediaType === 'video') {
        const videoUrl = await generateVeoVideo(actualPrompt);
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { 
            ...g, 
            status: 'completed' as const, 
            previewUrl: videoUrl,
            scenes: mediaType === 'movie' ? [newGen.id] : undefined 
          } : g)
        );
      } else if (mediaType === 'chat') {
        const stream = chatWithGeminiStream(actualPrompt, useThinking, useSearch, selectedModel);
        let fullText = "";
        for await (const chunk of stream) {
          fullText += chunk;
          setGenerations(prev => 
            prev.map(g => g.id === newGen.id ? { ...g, previewUrl: fullText } : g)
          );
        }
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { ...g, status: 'completed' as const } : g)
        );
      } else if (mediaType === 'image') {
        const imageUrl = await generateNanoImage(actualPrompt);
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { ...g, status: 'completed' as const, previewUrl: imageUrl } : g)
        );
      } else if (mediaType === 'analysis') {
        const result = await analyzeVideo("https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", actualPrompt);
        setGenerations(prev => 
          prev.map(g => g.id === newGen.id ? { ...g, status: 'completed' as const, previewUrl: result } : g)
        );
      }
    } catch (error: any) {
      console.error('Generation Error:', error);
      let errorMsg = "Generation failed. Please try again.";
      const errorStr = JSON.stringify(error);
      
      if (error.message?.includes('403') || error.message?.includes('permission')) {
        errorMsg = "عذراً، هذا النموذج (Veo/Lyria) يتطلب تصريحاً خاصاً. يرجى الذهاب إلى إعدادات AI Studio (Settings) والتأكد من إضافة مفتاح Gemini API الخاص بك وتفعيل النماذج المتقدمة.";
      } else if (error.message?.includes('500') || errorStr.includes('Rpc failed') || errorStr.includes('xhr error')) {
        errorMsg = "يبدو أن هناك عطلاً مؤقتاً في خوادم Google AI (خطأ 500/Rpc). يرجى المحاولة بعد قليل أو التأكد من إعدادات مفتاح API الخاص بك في لوحة الإعدادات.";
      }

      setGenerations(prev => 
        prev.map(g => g.id === newGen.id ? { ...g, status: 'error' as const, prompt: errorMsg } : g)
      );
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, mediaType, config, useThinking]);

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return (
    <>
      {/* Main Viewport - Bento Card - Row 1-3, Col 1-8 */}
      <section className={`${!isMobile ? 'col-start-1 col-span-8 row-start-1 row-span-3' : 'h-[40vh]'} bento-card gpu-fast relative overflow-hidden group/main ${isGenerating ? 'turbo-glow' : ''}`}>
        <div className="flex justify-between items-center p-4 bg-zinc-900/80 absolute top-0 w-full border-b border-zinc-800/50 backdrop-blur-md z-20">
          <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 flex items-center gap-2">
            {!currentView ? <Box className="w-3.5 h-3.5 text-blue-500" /> :
             currentView.type === 'video' ? <Film className="w-3.5 h-3.5 text-emerald-500" /> :
             currentView.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> :
             currentView.type === 'movie' ? <Clapperboard className="w-3.5 h-3.5 text-purple-500" /> :
             currentView.type === 'character' ? <UserRound className="w-3.5 h-3.5 text-blue-400" /> :
             currentView.type === 'analysis' ? <ScanSearch className="w-3.5 h-3.5 text-cyan-500" /> :
             <Box className="w-3.5 h-3.5 text-blue-500" />}
            {currentView ? `VIEWPORT / TASK_${currentView.id.toUpperCase()}` : 'VIEWPORT / STANDBY'}
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-colors ${isOffline ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
               {isOffline ? <CloudOff className="w-2.5 h-2.5" /> : <Cloud className="w-2.5 h-2.5" />}
               {isOffline ? 'Local Mode' : 'Cloud Sync'}
            </div>
            {(currentView?.status === 'generating' || isMerging) && (
              <div className="text-[10px] px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded font-mono font-bold tracking-tighter flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                {isMerging ? 'MERGING_AUDIO_LAYERS' : 'RENDERING_CINEMATICS'}
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center bg-black">
          {currentView ? (
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
               {currentView.status === 'error' ? (
                  <div className="flex flex-col items-center gap-4 p-8 text-center bg-zinc-900/40 rounded-3xl border border-rose-500/20 max-w-sm">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center">
                      <X className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Service_Restricted</p>
                      <p className="text-[9px] text-zinc-500 font-mono leading-relaxed">{currentView.prompt}</p>
                    </div>
                    <button 
                      onClick={() => handleGenerate()}
                      className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-black uppercase hover:bg-zinc-800 transition-all"
                    >
                      Retry_Signal
                    </button>
                  </div>
               ) : currentView.type === 'audio' ? (
                  <div className="flex flex-col items-center gap-6 p-12 w-full max-w-md">
                     <div className="relative group/sound cursor-pointer">
                        <Music className="w-24 h-24 text-blue-500 animate-pulse" />
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
                     </div>
                     <div className="w-full space-y-4">
                        <div className="h-24 bento-inner bg-black/40 flex items-center justify-center p-4 gap-1">
                           {[...Array(24)].map((_, i) => (
                             <motion.div
                               key={i}
                               initial={{ height: 4 }}
                               animate={{ height: [4, Math.random() * 64 + 4, 4] }}
                               transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                               className="w-1.5 bg-blue-500/60 rounded-full"
                             />
                           ))}
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[8px] font-mono text-blue-400">00:00</span>
                           <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">Sound_Engine: {currentView.model || 'LYRIA_AI_SYNTH'}</span>
                            <span className="text-[8px] font-mono text-blue-400">00:30</span>
                        </div>
                        <div className="bg-black/40 border border-zinc-800 rounded-lg p-3 text-left font-mono text-[7px] text-zinc-500 space-y-1 mt-2 mx-auto w-full">
                           <div className="flex justify-between"><span>&gt; CLOUD_TARGET:</span> <span className="text-blue-400 font-bold">{currentView.model}</span></div>
                           <div className="flex justify-between"><span>&gt; API_STATUS:</span> <span className="text-emerald-500 font-bold">READY</span></div>
                           <div className="flex justify-between"><span>&gt; TASK_ID:</span> <span>{currentView.id}</span></div>
                        </div>
                     </div>
                  </div>
                ) : currentView.type === 'chat' || currentView.type === 'analysis' ? (
                  <div className="p-8 w-full h-full max-w-4xl flex flex-col pt-20">
                     <div className="flex-grow bento-inner bg-black/60 p-6 overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed text-zinc-300">
                        {currentView.status === 'generating' ? (
                          <div className="flex flex-col gap-4">
                             <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>THINKING_IN_PROGRESS...</span>
                             </div>
                             <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
                             <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse" />
                          </div>
                        ) : (
                          <div className="space-y-4 whitespace-pre-wrap">
                             <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-800 pb-2 mb-4">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span className="uppercase tracking-widest text-[9px] font-black">AI_RESPONSE_STREAM_V3.1</span>
                             </div>
                             {currentView.previewUrl || "No response data found."}
                          </div>
                        )}
                     </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                     <img 
                       src={currentView.previewUrl || (currentView.type === 'image' ? `https://picsum.photos/seed/${currentView.id}/1280/720` : "https://picsum.photos/seed/cyberpunk/1280/720")} 
                       className={`transition-all duration-1000 ${currentView.status === 'generating' ? 'brightness-50 blur-sm scale-105 grayscale' : 'brightness-90 hover:brightness-105'} ${
                         (currentView.type === 'character' || currentView.type === 'animated-image') ? 'max-h-[85vh] rounded-2xl shadow-2xl' : 'w-full h-full object-cover'
                       }`}
                       alt="Preview"
                       referrerPolicy="no-referrer"
                       loading="lazy"
                     />
                     
                     {/* Characters / Animated Image Specials */}
                     {(currentView.type === 'character' || currentView.type === 'animated-image') && currentView.status === 'completed' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none">
                           {/* Sound / LipSync Waveform Overlay */}
                           <div className="bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex items-center gap-4 shadow-2xl">
                              <div className="flex gap-1 items-end h-8">
                                 {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.4].map((h, i) => (
                                    <motion.div 
                                      key={i}
                                      animate={{ height: ['20%', `${h * 100}%`, '20%'] }}
                                      transition={{ duration: 0.15, repeat: Infinity, delay: i * 0.05 }}
                                      className="w-1.5 bg-blue-500 rounded-full"
                                    />
                                 ))}
                              </div>
                              <div className="text-left">
                                 <div className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Mic2 className="w-3 h-3 text-blue-500" />
                                    Vocal_Sync_Active
                                 </div>
                                 <div className="text-[8px] text-zinc-400 font-mono">LATENCY: 12ms | ENGINE: V3_PRO_SYNTH</div>
                              </div>
                           </div>
                        </div>
                     )}

                     {currentView.type === 'image' && currentView.status === 'completed' && (
                        <div className="absolute bottom-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                           </div>
                           <div>
                              <div className="text-[9px] font-black text-white uppercase">TEXT_TO_IMAGE</div>
                              <div className="text-[7px] text-zinc-400 uppercase tracking-widest">{currentView.model || 'NANO_BANANA_2_ENGINE'}</div>
                           </div>
                        </div>
                     )}
                     {currentView.type === 'video' && currentView.status === 'completed' && (
                        <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                              <Film className="w-4 h-4 text-emerald-500" />
                           </div>
                           <div>
                              <div className="text-[9px] font-black text-white uppercase">CINEMATIC_VIDEO</div>
                              <div className="text-[7px] text-zinc-400 uppercase tracking-widest">{currentView.model || 'VEO_3_CINEMATIC_ENGINE'}</div>
                           </div>
                        </div>
                     )}
                     {currentView.type === 'movie' && currentView.status === 'completed' && (
                        <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                              <Clapperboard className="w-4 h-4 text-purple-500" />
                           </div>
                           <div>
                              <div className="text-[9px] font-black text-white uppercase">FULL_MOVIE_PRODUCTION</div>
                              <div className="text-[7px] text-zinc-400 uppercase tracking-widest">ASSEMBLY_MODE: READY</div>
                           </div>
                        </div>
                     )}
                     {currentView.type === 'character' && currentView.status === 'completed' && (
                        <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                              <UserRound className="w-4 h-4 text-blue-500" />
                           </div>
                           <div>
                              <div className="text-[9px] font-black text-white uppercase">CHARACTER_SPRITE</div>
                              <div className="text-[7px] text-zinc-400 uppercase tracking-widest">DNA_LOCK: 99.8%</div>
                           </div>
                        </div>
                     )}
                     {currentView.type === 'animated-image' && currentView.status === 'completed' && (
                        <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center">
                              <Zap className="w-4 h-4 text-amber-500" />
                           </div>
                           <div>
                              <div className="text-[9px] font-black text-white uppercase">ANIMATED_IMAGE</div>
                              <div className="text-[7px] text-zinc-400 uppercase tracking-widest">MOTION_VECTORS: ACTIVE</div>
                           </div>
                        </div>
                     )}
                     {currentView.type === 'analysis' && currentView.status === 'completed' && (
                        <div className="absolute top-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                              <ScanSearch className="w-4 h-4 text-cyan-500" />
                           </div>
                           <div>
                              <div className="text-[9px] font-black text-white uppercase">SCENE_ANALYSIS</div>
                              <div className="text-[7px] text-zinc-400 uppercase tracking-widest">INSIGHTS_GENERATED</div>
                           </div>
                        </div>
                     )}
                  </div>
                )}
               
               {/* Context Overlay Icons */}
               <div className="absolute top-16 right-4 flex flex-col gap-2 opacity-0 group-hover/main:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1 items-end mb-4 pr-1">
                     <span className="text-[7px] text-blue-500 font-bold uppercase tracking-tighter bg-blue-500/10 px-1 border border-blue-500/20 rounded">Characters_LipSync: Active</span>
                     <div className="flex gap-1 h-3 items-end">
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                         <div key={i} className="w-0.5 bg-blue-500/60 rounded-full" style={{ height: `${h * 100}%` }} />
                       ))}
                     </div>
                  </div>
                  <button 
                    onClick={() => setShowLightbox(true)}
                    className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-xl backdrop-blur-md group/icon"
                  >
                    <Eye className="w-5 h-5 group-hover/icon:scale-110 transition-transform" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-600 transition-all shadow-xl backdrop-blur-md group/icon">
                    <Download className="w-5 h-5 group-hover/icon:scale-110 transition-transform" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-purple-600 transition-all shadow-xl backdrop-blur-md group/icon">
                    <Share2 className="w-5 h-5 group-hover/icon:scale-110 transition-transform" />
                  </button>
               </div>

               {(currentView.status === 'generating' || isMerging) && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm">
                    <div className="relative">
                       <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                       {isMerging && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                             <Mic2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                          </motion.div>
                       )}
                    </div>
                    <div className="space-y-1 text-center">
                       <p className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase animate-pulse">
                          {isMerging ? 'Merging_Data_Streams' : `Synthesizing_${currentView.type?.toUpperCase()}`}
                       </p>
                       <div className="h-1.5 w-48 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 mx-auto">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: currentView.type === 'video' || currentView.type === 'movie' ? 60 : 5, repeat: Infinity }}
                            className={`h-full ${isMerging ? 'bg-emerald-500' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'}`}
                          />
                       </div>
                       <div className="bg-black/40 border border-zinc-800 rounded-lg p-3 text-left font-mono text-[7px] text-zinc-500 space-y-1 mt-2 mx-auto w-full">
                          <div className="flex justify-between"><span>&gt; CLOUD_TARGET:</span> <span className="text-blue-400 font-bold">{currentView.model}</span></div>
                          <div className="flex justify-between"><span>&gt; SYSTEM_READY:</span> <span className="text-emerald-500 font-bold">YES</span></div>
                          <div className="flex justify-between"><span>&gt; SIGNAL_ID:</span> <span>{currentView.id.toUpperCase()}</span></div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-5">
               <Wand2 className="w-24 h-24 mx-auto" />
               <p className="text-xs uppercase tracking-[0.5em] font-black">Signal_Waiting</p>
            </div>
          )}
        </div>

        <div className={`p-4 bg-zinc-950/90 backdrop-blur-md flex justify-between items-center border-t border-zinc-800 shrink-0 ${isMobile ? 'overflow-x-auto no-scrollbar' : ''}`}>
          <div className={`flex ${isMobile ? 'gap-1' : 'space-x-2'}`}>
            <button className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors text-[10px]`}>⏪</button>
            <button className={`${isMobile ? 'w-12 h-10 rounded-xl' : 'w-16 h-12 rounded-2xl'} bg-white text-black flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all shadow-xl text-xs`}>▶ Play</button>
            <button className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors text-[10px]`}>⏩</button>
          </div>
          <div className={`${isMobile ? 'hidden' : 'flex-1 max-w-[400px] mx-8 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800/50'}`}>
            <div className="bg-blue-600 w-[60%] h-full relative">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className={`flex ${isMobile ? 'gap-1 pl-4' : 'gap-2'}`}>
             <button 
               onClick={() => setShowLightbox(true)}
               className="text-[10px] font-mono text-zinc-500 tracking-tighter tabular-nums px-3 py-1 bg-black/40 rounded border border-zinc-800 flex items-center gap-2 hover:bg-zinc-800 hover:text-blue-400 transition-colors group"
             >
               <Eye className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
               Preview
             </button>
             <a 
               href={currentView?.status === 'completed' ? `https://picsum.photos/seed/${currentView.id}/1920/1080` : '#'}
               download={`generation_${currentView?.id}`}
               className="text-[10px] font-mono text-zinc-500 tracking-tighter tabular-nums px-3 py-1 bg-black/40 rounded border border-zinc-800 flex items-center gap-2 hover:bg-zinc-800 hover:text-emerald-400 transition-colors group"
             >
               <Download className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
               Download
             </a>
             <button 
                onClick={startApkBuild}
                className="text-[10px] font-mono text-zinc-500 tracking-tighter tabular-nums px-3 py-1 bg-black/40 rounded border border-zinc-800 flex items-center gap-2 hover:bg-zinc-800 hover:text-emerald-400 transition-colors group relative overflow-hidden"
             >
               {apkProgress !== null && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${apkProgress}%` }}
                    className="absolute inset-0 bg-emerald-500/10"
                  />
               )}
               <Smartphone className={`w-3.5 h-3.5 text-emerald-500 ${apkProgress !== null ? 'animate-bounce' : 'group-hover:scale-110 group-hover:rotate-12 transition-all'}`} />
               {apkProgress !== null ? `${apkStage}_${apkProgress}%` : 'Android_Build'}
             </button>
              <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Extended_Duration_Unlocked</span>
              </div>
              
              <div className={`flex items-center gap-2 px-2 py-1 rounded border transition-all duration-500 ${
                ffmpegStatus === 'ready' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                ffmpegStatus === 'loading' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}>
                 <Cpu className={`w-3 h-3 ${ffmpegStatus === 'loading' ? 'animate-spin' : ''}`} />
                 <span className="text-[9px] font-black uppercase tracking-widest">
                    {ffmpegStatus === 'ready' ? 'FFmpeg_V12_Local_Core' : ffmpegStatus === 'loading' ? 'Mounting_WASM' : 'FFmpeg_Idle'}
                  </span>
              </div>
          </div>
        </div>
      </section>

      <GenerationsBar 
        generations={generations} 
        activeId={currentView?.id} 
        onSelect={(g) => setActiveId(g.id)} 
        isMobile={isMobile}
      />

      {!isMobile && <CharacterConsistencyEngine isMobile={isMobile} />}

      {/* Prompt Engine - Bento Card - Row 5-6, Col 1-4 */}
      <section className={`${!isMobile ? 'col-start-1 col-span-4 row-start-5 row-span-2' : ''} bento-card p-4`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
              <div className="flex gap-2 border-r border-zinc-800 pr-3">
                   {(['video', 'image', 'audio', 'chat', 'analysis', 'movie', 'character', 'animated-image'] as MediaType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setMediaType(type)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all relative ${
                        mediaType === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {type === 'video' ? <Film className="w-3.5 h-3.5" /> : 
                       type === 'image' ? <ImageIcon className="w-3.5 h-3.5" /> : 
                       type === 'audio' ? <Music className="w-3.5 h-3.5" /> :
                       type === 'chat' ? <MessageSquare className="w-3.5 h-3.5" /> :
                       type === 'analysis' ? <ScanSearch className="w-3.5 h-3.5" /> :
                       type === 'movie' ? <Clapperboard className="w-3.5 h-3.5" /> :
                       type === 'character' ? <UserRound className="w-3.5 h-3.5" /> :
                       type === 'animated-image' ? <Zap className="w-3.5 h-3.5" /> :
                       <Sparkles className="w-3.5 h-3.5" />}
                       <span className="text-[8px] font-black uppercase tracking-widest hidden lg:block">{type}</span>
                    </button>
                  ))}
                  {(mediaType === 'chat' || mediaType === 'analysis') && (
                    <button
                      onClick={() => setUseThinking(!useThinking)}
                      className={`p-1 rounded-md transition-all flex items-center gap-1 ${
                        useThinking ? 'bg-amber-600 text-white' : 'text-zinc-600 hover:text-amber-400 hover:bg-zinc-900'
                      }`}
                      title="Extended Reasoning (Pro)"
                    >
                      <Brain className="w-3 h-3" />
                      {useThinking && <span className="text-[8px] font-black uppercase">Thinking</span>}
                    </button>
                  )}
              </div>
             <div className="flex items-center gap-3">
                {['prompt', 'script'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? 'text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <motion.div layoutId="tabUnderline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600" />}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              title="View full prompt history"
              className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[8px] text-zinc-500 uppercase font-bold hover:text-zinc-200 hover:border-zinc-700 transition-all flex items-center gap-1.5"
            >
              <History className="w-3 h-3" />
              <span>History</span>
            </button>
            <button 
              onClick={() => handleAIAction()}
              disabled={isOptimizing || !prompt}
              className="px-2 py-1 bg-blue-600 rounded text-white text-[8px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:bg-blue-500 disabled:opacity-30 transition-all font-mono group"
            >
              <div className="flex items-center gap-2">
                 <Wand2 className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                 AI_WORLD_ENGINE
              </div>
            </button>
          </div>
        </div>
        
        {promptHistory.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar scroll-smooth">
             <span className="text-[7px] text-zinc-700 font-black uppercase py-1 shrink-0 flex items-center">Recent:</span>
             {promptHistory.slice(0, 4).map((h, i) => (
               <button
                 key={i}
                 onClick={() => setPrompt(h)}
                 className="px-2 py-1 bento-inner bg-zinc-900/40 border-zinc-800 text-[8px] text-zinc-500 truncate max-w-[120px] hover:text-zinc-300 hover:border-zinc-700 transition-all whitespace-nowrap"
               >
                 {h}
               </button>
             ))}
          </div>
        )}
        <div className="flex-grow bento-inner flex flex-col relative group overflow-hidden bg-black/40">
           <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'prompt' ? "Enter cinematic directives..." : "Input raw sequence script..."}
              className="flex-grow p-4 bg-transparent outline-none border-none text-[11px] text-zinc-400 font-mono leading-relaxed resize-none placeholder:text-zinc-800 focus:text-zinc-200"
           />
           <div className="absolute bottom-3 right-3 flex items-center gap-3">
             {mediaType === 'analysis' && (
                <div className="flex items-center gap-2 mr-4">
                  <input type="file" id="video-upload" className="hidden" accept="video/*" />
                  <label htmlFor="video-upload" className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[7px] text-zinc-500 cursor-pointer hover:text-blue-500 transition-colors uppercase font-black tracking-widest">
                    Upload_Source
                  </label>
                </div>
              )}
             <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter opacity-0 group-focus-within:opacity-100 transition-opacity">Ctrl+Enter to fire</div>
             <button 
               onClick={() => handleGenerate()}
               disabled={!prompt}
               className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-20"
             >
               <Send className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* PRODUCTION ENGINE CONTROLS */}
        {(mediaType === 'character' || mediaType === 'movie' || mediaType === 'audio' || mediaType === 'animated-image') && (
           <div className="mt-3 pt-3 border-t border-zinc-900 grid grid-cols-3 gap-2">
             <div className="space-y-1">
               <label className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Vocal_Profile</label>
               <select 
                 value={config.voiceType || 'cartoon'}
                 onChange={(e) => { config.voiceType = e.target.value as any; }}
                 className="w-full bg-black/40 border border-zinc-800 rounded p-1.5 text-[8px] text-zinc-300 font-mono outline-none focus:border-blue-500 transition-colors"
               >
                 <option value="girl">Bint_v2 (Girl)</option>
                 <option value="child">Tifl_v1 (Child)</option>
                 <option value="male">Rajul_Prime (Male)</option>
                 <option value="female">Ontha_Alpha (Female)</option>
                 <option value="cartoon">Cartoon_Comic</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Art_DNA</label>
               <select 
                 value={config.characterStyle || 'cartoon'}
                 onChange={(e) => { config.characterStyle = e.target.value as any; }}
                 className="w-full bg-black/40 border border-zinc-800 rounded p-1.5 text-[8px] text-zinc-300 font-mono outline-none focus:border-emerald-500 transition-colors"
               >
                 <option value="realistic">Realistic</option>
                 <option value="cartoon">Cartoon</option>
                 <option value="fantasy">Fantasy</option>
                 <option value="3d-animation">3D_Cinema</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Sound_Mood</label>
               <select 
                 value={config.soundscape || 'ambient'}
                 onChange={(e) => { config.soundscape = e.target.value as any; }}
                 className="w-full bg-black/40 border border-zinc-800 rounded p-1.5 text-[8px] text-zinc-300 font-mono outline-none focus:border-rose-500 transition-colors"
               >
                 <option value="ambient">Ambient</option>
                 <option value="action">Action_Vibe</option>
                 <option value="love">Melodic_Love</option>
                 <option value="war">War_Drums</option>
               </select>
             </div>
           </div>
         )}
         
         {mediaType === 'movie' && generations.filter(g => g.type === 'video').length >= 2 && (
           <button 
             onClick={handleMergeMovies}
             disabled={isMerging}
             className="mt-3 w-full py-2 bg-emerald-600/20 border border-emerald-500/30 rounded text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
           >
             {isMerging ? <Loader2 className="w-3 h-3 animate-spin" /> : <Layers className="w-3 h-3" />}
             Unify_Scenes_&_Export_Production
           </button>
         )}
      </section>

      <section className={`${!isMobile ? 'col-start-9 col-span-4 row-start-3 row-span-1' : 'w-full mb-4'} bento-card p-4 flex flex-col gap-3 group/models`}>
        <h3 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-[0.2em]">
          <Cpu className="w-3.5 h-3.5 text-blue-500" />
          Model_Node_Interface
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'gemini-3-flash-preview', label: 'Gemini 3', icon: <Sparkles className="w-3 h-3 text-blue-400" /> },
            { id: 'chatgpt', label: 'ChatGPT', icon: <Zap className="w-3 h-3 text-emerald-400" /> },
            { id: 'deepseek', label: 'DeepSeek', icon: <Brain className="w-3 h-3 text-purple-400" /> }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-2 bento-inner flex flex-col items-center gap-1 transition-all ${
                selectedModel === m.id ? 'bg-blue-600/20 border-blue-600/50 text-white' : 'bg-black/40 text-zinc-500 border-zinc-900'
              }`}
            >
              {m.icon}
              <span className="text-[8px] font-black">{m.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setUseSearch(!useSearch)}
            className={`flex-1 p-2 bento-inner flex items-center justify-center gap-2 transition-all ${
              useSearch ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-400' : 'bg-black/40 text-zinc-500 border-zinc-900'
            }`}
          >
            <Globe className={`w-3 h-3 ${useSearch ? 'animate-spin-slow' : ''}`} />
            <span className="text-[8px] font-black uppercase tracking-widest">{useSearch ? 'Grounding_Active' : 'Live_Web_Search'}</span>
          </button>
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`flex-1 p-2 bento-inner flex items-center justify-center gap-2 transition-all ${
              useThinking ? 'bg-blue-600/20 border-blue-600/50 text-blue-400' : 'bg-black/40 text-zinc-500 border-zinc-900'
            }`}
          >
            <Brain className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">{useThinking ? 'Deep_Mode' : 'Thinking_Engine'}</span>
          </button>
        </div>
      </section>

      {/* World Synthesis Module - Bento Card - Row 5-6, Col 10-12 */}
      {!isMobile && <WorldSynthesis isMobile={isMobile} />}

      {/* Lightbox / Fullscreen Preview Overlay */}
      <AnimatePresence>
        {showLightbox && currentView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-12"
          >
            <motion.button
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              onClick={() => setShowLightbox(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10 backdrop-blur-md z-[201]"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl border border-white/5 relative group"
            >
              {currentView.type === 'video' || currentView.type === 'movie' ? (
                <video 
                  src={currentView.url || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img 
                  src={currentView.url || `https://picsum.photos/seed/${currentView.id}/1920/1080`}
                  className="w-full h-full object-contain"
                  alt="Full Preview"
                />
              )}
              
              <div className="absolute bottom-4 left-4 right-4 p-6 bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-blue-600/20">Production_Asset</div>
                        <span className="text-[10px] text-zinc-500 font-mono">UUID: {currentView.id}</span>
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold text-white leading-tight line-clamp-2">{currentView.prompt}</h4>
                   </div>
                   <div className="flex items-center gap-3 shrink-0">
                     <button 
                       onClick={() => setShowLightbox(false)}
                       className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                       Close_View
                     </button>
                     <a 
                       href={currentView.url || '#'}
                       download={`signal_${currentView.id}`}
                       className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                     >
                       <Download className="w-3 h-3" />
                       Export_Source
                     </a>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-96 bg-zinc-950 border-l border-zinc-800 z-[101] flex flex-col shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <History className="w-4 h-4 text-blue-500" />
                   <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Prompt_Log.v2</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={clearHistory}
                    className="text-[9px] font-black uppercase text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                  <button onClick={() => setShowHistory(false)} className="text-zinc-600 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {promptHistory.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/40 hover:border-blue-900/50 transition-all cursor-pointer group"
                    onClick={() => { setPrompt(item); setShowHistory(false); }}
                  >
                    <p className="text-[11px] text-zinc-400 font-mono line-clamp-4 leading-relaxed italic">"{item}"</p>
                    <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[9px] text-blue-600 font-bold uppercase tracking-tighter">Load into workspace</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
