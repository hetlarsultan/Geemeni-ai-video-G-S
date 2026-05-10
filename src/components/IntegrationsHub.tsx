import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  ExternalLink, 
  Zap, 
  MessageSquare, 
  Music, 
  Video, 
  ImageIcon, 
  Cpu, 
  Sparkles,
  Bot,
  Microscope,
  ArrowRight
} from 'lucide-react';

interface AIResource {
  id: string;
  name: string;
  nameAr: string;
  category: 'text' | 'image' | 'video' | 'audio' | 'all-in-one';
  url: string;
  description: string;
  descriptionAr: string;
  icon: any;
  color: string;
  apiKeyVar?: string;
}

const AI_RESOURCES: AIResource[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    nameAr: 'شات جي بي تي',
    category: 'text',
    url: 'https://chat.openai.com',
    description: 'Advanced reasoning and script writing partner.',
    descriptionAr: 'شريكك المتقدم في التفكير وكتابة السيناريو.',
    icon: Bot,
    color: 'bg-emerald-600',
    apiKeyVar: 'VITE_OPENAI_API_KEY'
  },
  {
    id: 'lovila',
    name: 'Lovila AI',
    nameAr: 'لوفيلا',
    category: 'all-in-one',
    url: '#',
    description: 'Creative design and visual synthesis hub.',
    descriptionAr: 'مركز التصميم الإبداعي والتركيب البصري.',
    icon: Sparkles,
    color: 'bg-indigo-600',
    apiKeyVar: 'API_KEY'
  },
  {
    id: 'sleepdeck',
    name: 'SleepDeck AI',
    nameAr: 'سليب ديك',
    category: 'audio',
    url: '#',
    description: 'Audio production and ambient environment synth.',
    descriptionAr: 'إنتاج الصوت والبيئة المحيطة الاصطناعية.',
    icon: Music,
    color: 'bg-purple-600',
    apiKeyVar: 'API_KEY'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    nameAr: 'ديب سيك',
    category: 'text',
    url: 'https://www.deepseek.com',
    description: 'High-performance open logic and coding model.',
    descriptionAr: 'نموذج منطق وبرمجة مفتوح وفائق الأداء.',
    icon: Cpu,
    color: 'bg-blue-600',
    apiKeyVar: 'VITE_DEEPSEEK_API_KEY'
  },
  {
    id: 'meta-ai',
    name: 'Meta AI (Llama)',
    nameAr: 'ميتا AI (لاما)',
    category: 'text',
    url: 'https://www.meta.ai',
    description: 'Meta\'s latest high-performance Llama models.',
    descriptionAr: 'أحدث نماذج لاما فائقة الأداء من شركة ميتا.',
    icon: Globe,
    color: 'bg-blue-500',
    apiKeyVar: 'VITE_META_AI_API_KEY'
  },
  {
    id: 'leonardo',
    name: 'Leonardo.ai',
    nameAr: 'ليوناردو',
    category: 'image',
    url: 'https://leonardo.ai',
    description: 'The standard for high-fidelity generative art.',
    descriptionAr: 'المعيار الذهبي للفنون التوليدية عالية الدقة.',
    icon: ImageIcon,
    color: 'bg-amber-600',
    apiKeyVar: 'VITE_LEONARDO_API_KEY'
  },
  {
    id: 'runway',
    name: 'RunwayML',
    nameAr: 'رن واي',
    category: 'video',
    url: 'https://runwayml.com',
    description: 'Professional grade AI video editing and generation.',
    descriptionAr: 'تحرير وتوليد الفيديو بالذكاء الاصطناعي للمحترفين.',
    icon: Video,
    color: 'bg-pink-600',
    apiKeyVar: 'VITE_RUNWAY_API_KEY'
  }
];

interface IntegrationsHubProps {
  onClose: () => void;
}

const IntegrationsHub = ({ onClose }: IntegrationsHubProps) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedResource = React.useMemo(() => 
    AI_RESOURCES.find(r => r.id === selectedId), 
  [selectedId]);

  return (
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-md rounded-3xl border border-zinc-800/50 overflow-hidden shadow-2xl selection:bg-blue-500/30 text-right relative" dir="rtl">
      <AnimatePresence>
        {selectedId && selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center"
          >
            <button 
              onClick={() => setSelectedId(null)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full space-y-8"
            >
              <div className={`w-24 h-24 ${selectedResource.color} rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)] mx-auto mb-6`}>
                <selectedResource.icon className="w-12 h-12 text-white" />
              </div>

              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{selectedResource.nameAr}</h2>
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.3em] font-black">{selectedResource.name} . INTEGRATION</div>
              </div>

              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">رمز الوصول المطلوب (API Key)</h4>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        (selectedResource.apiKeyVar === 'GEMINI_API_KEY' ? !!process.env.GEMINI_API_KEY : !!import.meta.env[selectedResource.apiKeyVar || '']) 
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                          : 'bg-red-500/50'
                      }`} />
                      <span className="text-[8px] font-black text-zinc-500">
                        {(selectedResource.apiKeyVar === 'GEMINI_API_KEY' ? !!process.env.GEMINI_API_KEY : !!import.meta.env[selectedResource.apiKeyVar || '']) 
                          ? 'متصل / ACTIVE' 
                          : 'غير متوفر / MISSING'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 bg-black py-4 px-6 rounded-2xl border border-zinc-800 group relative">
                    <code className="text-xl font-mono text-emerald-500 font-bold tracking-tighter">
                      {selectedResource.apiKeyVar}
                    </code>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      انسخ هذا الاسم
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-3">
                   <p className="text-xs text-zinc-400 leading-relaxed font-bold">
                     {selectedResource.descriptionAr}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      يستخدم هذا الرمز لربط خدمات {selectedResource.nameAr} مباشرة بالأستوديو الخاص بك.
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-blue-600 rounded-full text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 transition-colors shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                >
                  فتح الموقع الرسمي <ExternalLink className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-black uppercase text-zinc-500 hover:text-white transition-colors"
                >
                  رجوع للمركز
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
             <Globe className="w-6 h-6 text-blue-500" />
             مركز <span className="text-blue-500">التكامل العصبي</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Neural_Integrations_Center v2.0</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto no-scrollbar p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_RESOURCES.map((resource, i) => (
            <motion.button
              key={resource.id}
              onClick={() => setSelectedId(resource.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bento-card p-5 hover:border-blue-500/40 transition-all flex flex-col gap-4 relative overflow-hidden text-right"
            >
              {/* Background Glow */}
              <div className={`absolute top-0 left-0 w-24 h-24 ${resource.color} opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity`} />
              
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 ${resource.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <resource.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2">
                   <div className="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500">
                      {resource.category}
                   </div>
                   <Zap className="w-4 h-4 text-zinc-700 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
                  {resource.nameAr}
                </h3>
                <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                  {resource.descriptionAr}
                </p>
              </div>

              <div className="mt-2 pt-4 border-t border-zinc-900 flex justify-between items-center">
                 <span className="text-[9px] font-mono text-zinc-700">{resource.name} . GLOBAL_SYNC</span>
                 <ArrowRight className="w-3 h-3 text-zinc-800 group-hover:text-blue-500 transition-colors -rotate-180" />
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* API Credentials Management Guide */}
        <div className="mt-12 p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              إعداد مفاتيح الوصول (API Credentials)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px]">
              <div className="space-y-4">
                <div className="p-4 bento-inner bg-black/40">
                  <div className="text-blue-400 font-black mb-2 flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5" />
                    كيفية إضافة المفاتيح:
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-zinc-400 leading-relaxed font-bold">
                    <li>أفتح قائمة <span className="text-white">Settings</span> في AI Studio.</li>
                    <li>ابحث عن قسم <span className="text-white">API Keys</span>.</li>
                    <li>قم بإضافة المفتاح المطلوب بالاسم الصحيح (مثلاً: <code className="text-emerald-400">VITE_OPENAI_API_KEY</code>).</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bento-inner bg-black/40">
                   <div className="text-purple-400 font-black mb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    المتغيرات المتاحة:
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span className="text-zinc-500">Google Gemini</span>
                        <code className="text-emerald-500">GEMINI_API_KEY</code>
                     </div>
                     <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span className="text-zinc-500">OpenAI (GPT-4)</span>
                        <code className="text-emerald-500">VITE_OPENAI_API_KEY</code>
                     </div>
                     <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span className="text-zinc-500">DeepSeek API</span>
                        <code className="text-emerald-500">VITE_DEEPSEEK_API_KEY</code>
                     </div>
                     <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span className="text-zinc-500">Meta AI (Llama)</span>
                        <code className="text-emerald-500">VITE_META_AI_API_KEY</code>
                     </div>
                     <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span className="text-zinc-500">Internal Secret</span>
                        <code className="text-emerald-500">API_KEY</code>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Suggested Section */}
        <div className="mt-12 p-8 bg-blue-600/5 rounded-3xl border border-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
              <Microscope className="w-4 h-4" />
              توصيات المحترفين للمجاني
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-black uppercase">ClipDrop</div>
                <p className="text-[10px] text-zinc-500">أدوات تعديل صور ذكية وبسيطة من Stability AI.</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase">Suno AI</div>
                <p className="text-[10px] text-zinc-500">توليد مقطوعات غنائية كاملة مجانية يومياً.</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase">Krea.ai</div>
                <p className="text-[10px] text-zinc-500">أفضل أداة للتحسين الفوري والتوريث البصري.</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase">Lexica.art</div>
                <p className="text-[10px] text-zinc-500">محرك بحث فائق للصور المولدة بالذكاء الاصطناعي.</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase">Luma Genie</div>
                <p className="text-[10px] text-zinc-500">تحويل النصوص إلى نماذج ثلاثية الأبعاد 3D.</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black uppercase">Mistral Le Chat</div>
                <p className="text-[10px] text-zinc-500">بديل مجاني قوي وذكي جداً للنماذج اللغوية.</p>
              </div>
            </div>
          </div>
          <Zap className="absolute bottom-[-20%] left-[-5%] w-64 h-64 text-blue-600/5 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;
