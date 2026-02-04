
import React, { useState, useRef, useEffect } from 'react';
import { chatWithPro } from '../services/geminiService';
import { SYSTEM_PROMPTS } from '../constants';
import { Message } from '../types';

const GuidanceSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome. I'm here to support you in this new chapter. What's on your mind today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithPro(input, SYSTEM_PROMPTS.GUIDANCE);
      setMessages(prev => [...prev, { role: 'model', text: response || 'I am listening, but had a glitch. Please try again.', timestamp: Date.now() }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Personalized Support</h2>
        <p className="text-slate-500 mt-2">Guidance based on peer-support principles for your lifestyle journey.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-800'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl p-4 flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for advice, sharing a struggle, or just talk..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane px-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidanceSection;
