import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/30 mb-8 animate-bounce">
          <span className="text-5xl">🍷</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400 mb-6 tracking-tight">
          VinoMetrix
        </h1>
        
        <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed font-light">
          The industry standard for <span className="text-rose-400 font-semibold">AI Wine Quality Assurance</span>. 
          Analyze chemical signatures in real-time.
        </p>

        <button
          onClick={() => navigate('/predict')}
          className="group relative px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
        >
          <span className="relative z-10">Start Analysis →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
}

export default Welcome;