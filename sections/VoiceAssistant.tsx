
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getAIClient, decodeBase64, decodeAudioData, encodeAudio } from '../services/geminiService';
import { MODELS, SYSTEM_PROMPTS } from '../constants';
import { LiveServerMessage, Modality } from '@google/genai';

const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'error'>('idle');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      // Assuming sessionRef.current.close() or similar if available
    }
    setIsActive(false);
    setStatus('idle');
    audioContextRef.current?.close();
    outContextRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  }, []);

  const startBridge = async () => {
    try {
      setStatus('connecting');
      const ai = getAIClient();
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: MODELS.VOICE,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: SYSTEM_PROMPTS.VOICE_ASSISTANT,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64 = encodeAudio(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) {
              setTranscription(prev => [...prev.slice(-4), `You: ${msg.serverContent?.inputTranscription?.text}`]);
            }
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev.slice(-4), `Bridge: ${msg.serverContent?.outputTranscription?.text}`]);
            }

            const audioBase64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const data = decodeBase64(audioBase64);
              const buffer = await decodeAudioData(data, outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('error');
          },
          onclose: () => cleanup()
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-4">Voice Bridge</h2>
        <p className="text-slate-500 max-w-md mx-auto">A companion for your daily journey. Speak naturally, the Bridge is here to listen.</p>
      </div>

      <div className="relative group">
        {/* Animated Glow Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 scale-150"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10 scale-110 delay-300"></div>
          </>
        )}
        
        <button 
          onClick={isActive ? cleanup : startBridge}
          disabled={status === 'connecting'}
          className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
            isActive 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-400/50' 
              : 'bg-white hover:bg-slate-50 shadow-slate-200 text-slate-400 hover:text-blue-500'
          }`}
        >
          {status === 'connecting' ? (
            <i className="fa-solid fa-circle-notch animate-spin text-5xl text-blue-500"></i>
          ) : isActive ? (
            <i className="fa-solid fa-waveform text-5xl text-white"></i>
          ) : (
            <i className="fa-solid fa-microphone text-5xl"></i>
          )}
        </button>
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {status === 'connecting' ? 'Establishing Connection...' : status === 'listening' ? 'Bridge Active' : status === 'error' ? 'Connection Error' : 'Ready to Connect'}
          </span>
        </div>

        <div className="bg-slate-100/50 rounded-2xl p-6 min-h-[12rem] border border-slate-200 flex flex-col gap-3">
          {transcription.length > 0 ? (
            transcription.map((t, i) => (
              <p key={i} className={`text-sm ${t.startsWith('Bridge:') ? 'text-blue-700 font-medium' : 'text-slate-500'}`}>
                {t}
              </p>
            ))
          ) : (
            <p className="text-slate-400 text-center italic mt-12">Conversations will appear here</p>
          )}
        </div>
      </div>

      {!isActive && status !== 'connecting' && (
        <button 
          onClick={startBridge}
          className="bg-blue-600 text-white font-bold py-4 px-12 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          Wake Bridge
        </button>
      )}
    </div>
  );
};

export default VoiceAssistant;
