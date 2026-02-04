
import React, { useState } from 'react';
import { generateImage, editImage, analyzeImage, generateVideo } from '../services/geminiService';

const AILabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'analyze' | 'video'>('create');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setResultImage(null);
    try {
      const img = await generateImage(prompt, size);
      setResultImage(img);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!uploadedImage) return;
    setLoading(true);
    setResultImage(null);
    try {
      const img = await editImage(uploadedImage, prompt);
      setResultImage(img);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    setLoading(true);
    setAnalysisText(null);
    try {
      const text = await analyzeImage(uploadedImage, prompt || "Describe this image for me.");
      setAnalysisText(text);
    } finally {
      setLoading(false);
    }
  };

  const handleVideo = async () => {
    if (!uploadedImage) return;
    setLoading(true);
    setResultVideo(null);
    try {
      const video = await generateVideo(uploadedImage, prompt);
      setResultVideo(video);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold">AI Visual Lab</h2>
        <p className="text-slate-500 mt-2">Create and edit visual representations of your new life.</p>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full max-w-2xl overflow-x-auto no-scrollbar">
        {(['create', 'edit', 'analyze', 'video'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          {(activeTab === 'edit' || activeTab === 'analyze' || activeTab === 'video') && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Source Image</label>
              <div 
                onClick={() => document.getElementById('file-input')?.click()}
                className="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-center items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
              >
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Upload" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 mb-2"></i>
                    <p className="text-sm text-slate-400">Click to upload photo</p>
                  </div>
                )}
              </div>
              <input id="file-input" type="file" hidden accept="image/*" onChange={handleFileUpload} />
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">
              {activeTab === 'create' ? 'Image Description' : activeTab === 'edit' ? 'Edit Instructions' : activeTab === 'analyze' ? 'Question about Image' : 'Video Scene Description'}
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'create' ? "Describe your vision..." : activeTab === 'edit' ? "e.g., Add a sunset, retro filter..." : activeTab === 'analyze' ? "What do you see here?" : "Describe how you want it to move..."}
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500/20"
            />
          </div>

          {activeTab === 'create' && (
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as const).map(s => (
                <button 
                  key={s} 
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${size === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button 
            disabled={loading || (activeTab !== 'create' && !uploadedImage)}
            onClick={activeTab === 'create' ? handleCreate : activeTab === 'edit' ? handleEdit : activeTab === 'analyze' ? handleAnalyze : handleVideo}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-blue-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> Processing...
              </span>
            ) : (
              activeTab === 'create' ? 'Generate Image' : activeTab === 'edit' ? 'Apply Changes' : activeTab === 'analyze' ? 'Analyze' : 'Create Video'
            )}
          </button>
        </div>

        <div className="space-y-6">
          {loading && (
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-800 font-medium">Brewing your creation...</p>
              {activeTab === 'video' && <p className="text-xs text-blue-600 mt-2">Video generation can take a few minutes. Please stay on this page.</p>}
            </div>
          )}

          {resultImage && (
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 group relative">
              <img src={resultImage} alt="Result" className="w-full rounded-2xl" />
              <div className="absolute top-8 right-8 flex gap-2">
                <a href={resultImage} download="bridge-creation.png" className="bg-white/90 hover:bg-white text-slate-800 p-3 rounded-xl shadow-lg transition-all opacity-0 group-hover:opacity-100">
                  <i className="fa-solid fa-download"></i>
                </a>
              </div>
            </div>
          )}

          {resultVideo && (
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
              <video src={resultVideo} controls className="w-full rounded-2xl shadow-inner bg-black aspect-video" autoPlay loop muted />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Generated Video</span>
                <a href={resultVideo} download="bridge-video.mp4" className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:underline">
                  <i className="fa-solid fa-download"></i> Save Video
                </a>
              </div>
            </div>
          )}

          {analysisText && (
            <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl shadow-2xl leading-relaxed whitespace-pre-wrap">
              <h4 className="text-blue-400 font-bold mb-4 uppercase text-xs tracking-widest">AI Analysis</h4>
              {analysisText}
            </div>
          )}

          {!loading && !resultImage && !resultVideo && !analysisText && (
            <div className="h-64 flex flex-center items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <p className="text-slate-300 font-medium italic">Your creation will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AILabSection;
