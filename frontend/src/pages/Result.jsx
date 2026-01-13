import { useLocation, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Protect the route: Redirect if no data exists
  if (!location.state) {
    navigate('/');
    return null;
  }

  const { result, features } = location.state;
  const isPremium = result.quality_verdict === "Premium";

  // Prepare Chart Data
  const chartData = [
    { subject: 'Acidity', A: features.fixed_acidity * 10, fullMark: 150 },
    { subject: 'Sugar', A: features.residual_sugar * 5, fullMark: 150 },
    { subject: 'Alcohol', A: features.alcohol * 8, fullMark: 150 },
    { subject: 'Sulphates', A: features.sulphates * 100, fullMark: 150 },
    { subject: 'pH', A: features.pH * 20, fullMark: 150 },
    { subject: 'Density', A: (1 - features.density) * 1000, fullMark: 150 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: The Verdict Card */}
        <div className={`relative overflow-hidden p-10 rounded-3xl border flex flex-col justify-center items-center text-center backdrop-blur-md transition-all duration-700 ${
          isPremium 
            ? "bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)]" 
            : "bg-rose-950/30 border-rose-500/30 shadow-[0_0_60px_-15px_rgba(244,63,94,0.3)]"
        }`}>
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
          
          <h3 className="uppercase tracking-[0.3em] text-xs font-bold opacity-60 mb-6">Analysis Complete</h3>
          
          <h1 className={`text-6xl md:text-8xl font-black mb-6 tracking-tighter ${isPremium ? "text-emerald-400" : "text-rose-400"}`}>
            {result.quality_verdict}
          </h1>
          
          <div className={`px-6 py-2 rounded-full font-bold mb-10 text-sm tracking-wide border ${
            isPremium ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-rose-500/10 border-rose-500/50 text-rose-400"
          }`}>
            CONFIDENCE SCORE: {result.confidence}%
          </div>
          
          <button 
            onClick={() => navigate('/predict')}
            className="group px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all font-medium flex items-center gap-2"
          >
            <span>Run Another Test</span>
          </button>
        </div>

        {/* Right: The Chart */}
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 h-[500px] relative">
          <h3 className="text-center text-slate-400 mb-6 font-medium">Flavor Profile Fingerprint</h3>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar
                name="Wine Profile"
                dataKey="A"
                stroke={isPremium ? "#34d399" : "#fb7185"}
                strokeWidth={3}
                fill={isPremium ? "#34d399" : "#fb7185"}
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Result;