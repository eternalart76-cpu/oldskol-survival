
import React, { useState, useEffect } from 'react';
import { AppSection } from './types';
import Sidebar from './components/Sidebar';
import LandingPage from './sections/LandingPage';
import GuidanceSection from './sections/GuidanceSection';
import FinanceSection from './sections/FinanceSection';
import CommunitySection from './sections/CommunitySection';
import AILabSection from './sections/AILabSection';
import VoiceAssistant from './sections/VoiceAssistant';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.LANDING);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  if (currentSection === AppSection.LANDING) {
    return <LandingPage onEnter={() => setCurrentSection(AppSection.GUIDANCE)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-slate-800 animate-in fade-in duration-700">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentSection={currentSection} 
        onNavigate={setCurrentSection} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scroll bg-slate-50 relative">
        {!hasApiKey && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-center items-center justify-center p-6 text-center">
            <div className="max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-key text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">API Setup Required</h2>
              <p className="text-slate-600 mb-6">
                To access advanced features like high-quality video generation and pro image creation, 
                you'll need to link a paid Google AI project.
              </p>
              <button 
                onClick={handleOpenKeySelector}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-200"
              >
                Connect API Key
              </button>
              <p className="mt-4 text-xs text-slate-400">
                Need help? <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-blue-500">View Billing Docs</a>
              </p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
          {currentSection === AppSection.GUIDANCE && <GuidanceSection />}
          {currentSection === AppSection.FINANCE && <FinanceSection />}
          {currentSection === AppSection.COMMUNITY && <CommunitySection />}
          {currentSection === AppSection.AI_LAB && <AILabSection />}
          {currentSection === AppSection.VOICE && <VoiceAssistant />}
        </div>
      </main>
    </div>
  );
};

export default App;
