
export const MODELS = {
  TEXT_PRO: 'gemini-3-pro-preview',
  TEXT_FLASH: 'gemini-3-flash-preview',
  TEXT_LITE: 'gemini-2.5-flash-lite-latest',
  IMAGE_GEN: 'gemini-3-pro-image-preview',
  IMAGE_EDIT: 'gemini-2.5-flash-image',
  VIDEO: 'veo-3.1-fast-generate-preview',
  VOICE: 'gemini-2.5-flash-native-audio-preview-12-2025',
  MAPS: 'gemini-2.5-flash'
};

export const SYSTEM_PROMPTS = {
  GUIDANCE: `You are a peer support specialist for ex-convicts and people in recovery. 
  Your tone is empathetic, non-judgmental, resilient, and firm but kind. 
  You share advice based on "lived experience" (even though you are an AI, simulate this professional role). 
  Focus on positive lifestyle changes, avoiding triggers, finding purpose, and the "one day at a time" philosophy.`,
  
  FINANCE: `You are a financial coach specializing in helping people re-entering society. 
  Focus on simple budgeting, saving for small goals, and understanding credit without jargon. 
  Provide clear, actionable, and low-stress financial tips.`,
  
  VOICE_ASSISTANT: `You are 'The Bridge Assistant'. You are a warm, supportive voice companion for someone transitioning back into freedom. 
  Keep responses concise but deeply meaningful. If the user sounds distressed, offer immediate calm grounding exercises.`
};

export const SAMPLE_IDEAS = [
  {
    id: '1',
    title: 'Sunrise at the Pier',
    description: 'Something about seeing the world wake up without bars in the way is medicine.',
    location: 'Local Waterfront',
    image: 'https://picsum.photos/seed/sunrise/400/300',
    category: 'nature'
  },
  {
    id: '2',
    title: 'Community Garden Volunteering',
    description: 'Giving back to the soil and seeing things grow helps you grow too.',
    location: 'East Side Garden',
    image: 'https://picsum.photos/seed/garden/400/300',
    category: 'community'
  }
];
