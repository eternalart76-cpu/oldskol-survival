
import React from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onNavigate }) => {
  const items = [
    { id: AppSection.GUIDANCE, icon: 'fa-hands-helping', label: 'Peer Support' },
    { id: AppSection.FINANCE, icon: 'fa-wallet', label: 'Finance Coach' },
    { id: AppSection.COMMUNITY, icon: 'fa-users', label: 'Community' },
    { id: AppSection.AI_LAB, icon: 'fa-flask', label: 'AI Lab' },
    { id: AppSection.VOICE, icon: 'fa-microphone', label: 'Voice Bridge' },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <div className="p-6">
        <div 
          className="flex items-center gap-3 mb-8 cursor-pointer group"
          onClick={() => onNavigate(AppSection.LANDING)}
        >
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all group-hover:scale-110 group-hover:bg-red-500">
            S
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Survival</h1>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                currentSection === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <button 
          onClick={() => onNavigate(AppSection.LANDING)}
          className="w-full flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
        >
          <i className="fa-solid fa-house"></i>
          Back to Front
        </button>
        <div className="bg-slate-800 rounded-xl p-4 text-xs">
          <p className="font-semibold text-slate-400 mb-2 uppercase tracking-wider">Peer Certified</p>
          <p className="leading-relaxed">Using lived experience and certified peer support methods to help you thrive.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
