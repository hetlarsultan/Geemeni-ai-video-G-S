import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Zap, Sparkles, Globe, ShieldCheck, Cpu } from 'lucide-react';

interface PublicLandingProps {
  onEnter: () => void;
}

const PublicLanding = ({ onEnter }: PublicLandingProps) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black text-white font-sans overflow-y-auto selection:bg-blue-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-8 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Box className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase leading-none">
            أستوديو <span className="text-blue-500 font-black">المحترفين</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <a href="#" className="hover:text-blue-500 transition-colors">عن المؤسسة</a>
          <a href="#" className="hover:text-blue-500 transition-colors">الخدمات</a>
          <a href="#" className="hover:text-blue-500 transition-colors">المطورين</a>
          <button 
            onClick={onEnter}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all text-white"
          >
            دخول الأستوديو
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Zap className="w-3 h-3 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">الإصدار 2.5 : المسرع النووي</span>
          </div>
          
          <h2 className="text-6xl md:text-[140px] font-display leading-[0.85] tracking-tighter uppercase">
            <span className="block italic serif font-light text-zinc-500 text-4xl md:text-6xl mb-4 lowercase tracking-normal font-sans">limitless.</span>
            A.I CREATIVE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">PRODUCTION</span>
          </h2>

          <p className="max-w-2xl mx-auto text-zinc-400 text-sm md:text-lg font-medium leading-relaxed">
            المنصة العالمية الأولى للإنتاج السينمائي المتكامل بالذكاء الاصطناعي. 
            تخيل، ابتكر، وأنتج فوراً بتقنيات
            <span className="text-white"> Veo 3 Cinematic </span> 
            و
            <span className="text-white"> Nano Banana 2 </span>.
          </p>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="group relative px-12 py-5 bg-blue-600 rounded-full overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3 text-lg font-black uppercase tracking-wider">
                ابدأ رحلتك الإبداعية
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            
            <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
              شاهد العرض الترويجي
              <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-current border-b-[4px] border-b-transparent ml-0.5" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Features Slider / Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            { icon: Globe, title: "الوصول العالمي", desc: "أقوى النماذج اللغوية (Gemini-DeepSeek-ChatGPT) في منصة واحدة." },
            { icon: ShieldCheck, title: "أمان المؤسسات", desc: "حماية كاملة لبياناتك وإنتاجك بفهرسة سحابية مشفرة." },
            { icon: Cpu, title: "المسرع النووي", desc: "عملية معالجة فائقة السرعة Ultra-Fast Precision للأعمال الضخمة." }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl backdrop-blur-xl text-right hover:border-blue-500/30 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 mr-0 ml-auto">
                <f.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3 leading-none tracking-tight">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-bold">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Live Status Bar */}
        <div className="mt-40 w-full flex flex-col md:flex-row items-center justify-between border-t border-zinc-900 pt-8 gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              النظام: مستقر وسريع
            </span>
            <span className="text-zinc-800">/</span>
            <span>الخادم: الاتحاد الأوروبي 2</span>
          </div>
          <div className="flex gap-8">
            <span>حقوق الطبع والنشر © 2026</span>
            <span>مختبرات الذكاء الاصطناعي</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicLanding;
