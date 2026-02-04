
import React, { useState } from 'react';
import { mapsGrounding, searchGrounding } from '../services/geminiService';
import { SAMPLE_IDEAS } from '../constants';

const CommunitySection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ text: string; links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'maps' | 'search'>('maps');

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      let res;
      if (mode === 'maps') {
        res = await mapsGrounding(search);
      } else {
        res = await searchGrounding(search);
      }
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold">Community & Freedom</h2>
        <p className="text-slate-500 mt-2">Discover places to visit and resources for a life of freedom.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-6">Find Local Resources</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={mode === 'maps' ? "e.g., Parks near downtown, Recovery centers..." : "e.g., Job training programs, Legal help..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500/20"
            />
            <i className={`fa-solid ${mode === 'maps' ? 'fa-location-dot' : 'fa-magnifying-glass'} absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-xl`}></i>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setMode('maps')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'maps' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Maps
            </button>
            <button 
              onClick={() => setMode('search')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Search
            </button>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {loading ? 'Finding...' : 'Go'}
          </button>
        </div>

        {results && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">{results.text}</p>
            {results.links.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sources & Links</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                    >
                      <i className={`fa-solid ${mode === 'maps' ? 'fa-map-pin' : 'fa-link'} text-blue-500`}></i>
                      <span className="text-sm font-medium truncate group-hover:text-blue-600">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Shared Experiences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_IDEAS.map(idea => (
            <div key={idea.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
              <img src={idea.image} alt={idea.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold">{idea.title}</h4>
                  <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md uppercase">{idea.category}</span>
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{idea.description}</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{idea.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
