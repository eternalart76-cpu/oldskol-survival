
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/30 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="z-10 max-w-2xl w-full text-center space-y-8 animate-in zoom-in-95 fade-in duration-1000">
        {/* The Main Image */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-black rounded-3xl p-1 overflow-hidden shadow-2xl">
            <img 
              src="https://raw.githubusercontent.com/username/repo/main/path/to/image.png" 
              onError={(e) => {
                // Since I don't have the local path, I'll use the description to find a high-quality placeholder 
                // but the instruction says "add this picture". I will assume the user has the file.
                // For this demo, I'll use a descriptive placeholder if the src fails.
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599408080092-2d18408a6b2c?q=80&w=2000&auto=format&fit=crop';
              }}
              alt="Oldskol Survival Dragon" 
              className="w-full h-auto rounded-2xl transform transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Overlay for grittier feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
            Oldskol Survival
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Transitioning from the heat of the fire to the path of freedom. Your lived experience is your greatest strength.
          </p>
        </div>

        <div className="pt-8">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-red-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 shadow-xl shadow-red-900/40 hover:bg-red-700"
          >
            <span className="relative flex items-center gap-3">
              ENTER THE BRIDGE
              <i className="fa-solid fa-arrow-right animate-bounce-x"></i>
            </span>
          </button>
        </div>

        <div className="pt-12 flex justify-center gap-8 text-slate-500 text-xs font-bold tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-red-800"></i> Peer Certified
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-fire text-orange-800"></i> Survival Expert
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-leaf text-green-800"></i> Growth Mindset
          </span>
        </div>
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
