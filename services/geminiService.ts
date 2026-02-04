
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MODELS } from "../constants";

export const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export async function chatWithPro(message: string, systemInstruction: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT_PRO,
    contents: message,
    config: { systemInstruction }
  });
  return response.text;
}

export async function fastFlashResponse(prompt: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT_LITE,
    contents: prompt
  });
  return response.text;
}

export async function searchGrounding(query: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT_FLASH,
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Resource Link',
    uri: chunk.web?.uri || '#'
  })) || [];
  
  return { text: response.text, links };
}

export async function mapsGrounding(query: string, lat?: number, lng?: number) {
  const ai = getAIClient();
  const config: any = {
    tools: [{ googleMaps: {} }]
  };
  
  if (lat && lng) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: { latitude: lat, longitude: lng }
      }
    };
  }

  const response = await ai.models.generateContent({
    model: MODELS.MAPS,
    contents: query,
    config
  });

  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.maps?.title || 'Map Location',
    uri: chunk.maps?.uri || '#'
  })) || [];

  return { text: response.text, links };
}

export async function generateImage(prompt: string, size: string = '1K') {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_GEN,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function editImage(base64: string, prompt: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_EDIT,
    contents: {
      parts: [
        { inlineData: { data: base64.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function analyzeImage(base64: string, prompt: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT_PRO,
    contents: {
      parts: [
        { inlineData: { data: base64.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });
  return response.text;
}

export async function generateVideo(base64: string, prompt: string, aspectRatio: string = '16:9') {
  const ai = getAIClient();
  let operation = await ai.models.generateVideos({
    model: MODELS.VIDEO,
    prompt: prompt,
    image: {
      imageBytes: base64.split(',')[1],
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as any
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (downloadLink) {
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
  return null;
}

// Live API PCM helpers
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encodeAudio(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
