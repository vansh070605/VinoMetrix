import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Predict() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // The "Premium" Default Configuration
  const [features, setFeatures] = useState({
    fixed_acidity: 8.5,
    volatile_acidity: 0.3,
    citric_acid: 0.45,
    residual_sugar: 2.5,
    chlorides: 0.055,
    free_sulfur_dioxide: 14,
    total_sulfur_dioxide: 40,
    density: 0.991,
    pH: 3.3,
    sulphates: 0.80,
    alcohol: 12.8
  });

  const handleChange = (e) => {
    setFeatures({ ...features, [e.target.name]: parseFloat(e.target.value) });
  };

  const predictQuality = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://vinometrix-api.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
      });
      const data = await response.json();
      
      // PASS DATA TO THE NEXT PAGE
      navigate('/result', { state: { result: data, features: features } });
      
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative">
        
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors">
          ← Back
        </button>

        <h2 className="text-3xl font-bold mb-2 text-center mt-6">Configure Batch Parameters</h2>
        <p className="text-slate-400 text-center mb-10">Adjust slider values to match the spectrometer reading.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
          {[
            { label: 'Alcohol (%)', name: 'alcohol', min: 8, max: 15, step: 0.1 },
            { label: 'Fixed Acidity', name: 'fixed_acidity', min: 4, max: 16, step: 0.1 },
            { label: 'Volatile Acidity', name: 'volatile_acidity', min: 0.1, max: 1.6, step: 0.01 },
            { label: 'Residual Sugar', name: 'residual_sugar', min: 0, max: 15, step: 0.1 },
            { label: 'pH Level', name: 'pH', min: 2.5, max: 4.5, step: 0.01 },
            { label: 'Sulphates', name: 'sulphates', min: 0.3, max: 2.0, step: 0.01 }
          ].map((field) => (
            <div key={field.name} className="group">
              <div className="flex justify-between mb-3">
                <label className="font-medium text-slate-300 group-hover:text-rose-400 transition-colors">{field.label}</label>
                <span className="font-mono bg-slate-800 px-3 py-1 rounded text-sm text-rose-300">{features[field.name]}</span>
              </div>
              <input
                type="range"
                name={field.name}
                min={field.min}
                max={field.max}
                step={field.step}
                value={features[field.name]}
                onChange={handleChange}
                className="w-full accent-rose-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={predictQuality}
          disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-rose-600 to-purple-600 rounded-xl font-bold text-xl shadow-lg shadow-rose-900/20 hover:shadow-rose-600/40 hover:scale-[1.01] active:scale-95 transition-all"
        >
          {loading ? "Processing..." : "Run AI Analysis"}
        </button>
      </div>
    </div>
  );
}

export default Predict;