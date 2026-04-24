export type VideoModel = 
  | 'Sora 2' 
  | 'Kling v1.5' 
  | 'Veo 3.1' 
  | 'Luma Dream Machine' 
  | 'Runway Gen-3' 
  | 'Midjourney v6' 
  | 'DALL-E 3' 
  | 'ElevenLabs Alpha'
  | 'Veo 3'
  | 'Nano Banana 2'
  | 'Lyria'
  | 'Gemini 3.1 Pro';

export type MediaType = 'video' | 'image' | 'audio' | 'chat' | 'analysis' | 'movie' | 'character' | 'animated-image';

export type CharacterStyle = 'realistic' | 'cartoon' | 'fantasy' | '3d-animation';

export interface ShotConfig {
  shotType: string;
  motion: string;
  lighting: string;
  style: string;
  fps: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  characterStyle?: CharacterStyle;
  voiceType?: 'girl' | 'child' | 'male' | 'female' | 'cartoon';
  soundscape?: 'love' | 'action' | 'war' | 'ambient';
}

export interface Generation {
  id: string;
  type: MediaType;
  timestamp: number;
  prompt: string;
  model: string;
  config: ShotConfig;
  status: 'generating' | 'completed' | 'failed' | 'error';
  previewUrl?: string;
  scenes?: string[]; // IDs of other generations included in this movie
}
