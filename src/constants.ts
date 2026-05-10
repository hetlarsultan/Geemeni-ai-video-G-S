import { Character } from './types';

export const FIXED_CHARACTERS: Character[] = [
  // Realistic Subjects
  {
    id: "realistic-girl",
    name: "Arabic Girl",
    nameAr: "بنت عربية",
    role: "شخصية رئيسية",
    description: "فتاة عربية بملامح جذابة وعيون معبرة، تم تدريبها خصيصاً لتحريك الشفاه بتقنية SadTalker.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    style: "realistic"
  },
  {
    id: "realistic-young-man",
    name: "Arab Young Man",
    nameAr: "شاب عربي",
    role: "بطل القصة",
    description: "شاب عربي في العشرينات بملامح حادة ومظهر عصري وأنيق. يمتلك نظرة واثقة وصوت قوي.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300",
    style: "realistic",
    preferredVoice: "syrian",
    preferredDialect: "syrian"
  },
  {
    id: "nabati-poetess",
    name: "Nabati Poetess",
    nameAr: "شاعرة النبط",
    role: "شاعرة / أديبة",
    description: "امرأة أنيقة ذات ملامح راقية، متخصصة في الشعر النبطي. صوت أنثوي ناعم وبليغ.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300&h=300",
    style: "realistic",
  },
  // Cartoon Stylized
  { 
    id: 'cartoon-boy', 
    name: 'Cartoon Boy', 
    nameAr: 'نصور (كرتون)', 
    role: 'بطل القصة', 
    description: 'ولد كرتوني لطيف بعيون واسعة ومعبرة ملابس مستقبلية زاهية. لمسة ديزني عربية.', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
    style: 'cartoon'
  },
  { 
    id: 'cartoon-girl', 
    name: 'Cartoon Girl', 
    nameAr: 'لولو (كرتون)', 
    role: 'شخصية مرحة', 
    description: 'بنت كرتونية مرحة بألوان زاهية وتصميم جذاب يناسب قصص الأطفال.', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
    style: 'cartoon'
  }
];

export const VISUAL_FILTERS = [
  { id: 'none', name: 'الأصلي', class: '' },
  { id: 'sepia', name: 'تاريخي (سيبيا)', class: 'sepia-[0.6] contrast-[1.1]' },
  { id: 'bw', name: 'أبيض وأسود', class: 'grayscale' },
  { id: 'vintage', name: 'عتيق (السبعينات)', class: 'sepia-[0.3] brightness-[1.1] contrast-[0.9] saturate-[0.8]' },
  { id: 'cinematic', name: 'سينمائي احترافي', class: 'hue-rotate-[10deg] saturate-[1.2] contrast-[1.1]' },
  { id: 'noir', name: 'ظلال معتمة', class: 'grayscale brightness-[0.7] contrast-[1.5]' },
  { id: 'vibrant', name: 'ألوان حيوية', class: 'saturate-[1.8] brightness-[1.1]' },
] as const;
