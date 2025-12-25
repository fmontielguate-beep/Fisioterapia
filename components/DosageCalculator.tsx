
import React, { useState, useEffect } from 'react';
import { X, Calculator, Beaker, Info, ArrowLeft } from 'lucide-react';

interface DosageCalculatorProps {
  initialWeight?: number;
  onClose: () => void;
}

const DosageCalculator: React.FC<DosageCalculatorProps> = ({ initialWeight = 70, onClose }) => {
  const [weight, setWeight] = useState(initialWeight);
  const [concentration, setConcentration] = useState(10); // mg/ml
  const [dosage, setDosage] = useState(0.5); // mg/kg
  const [result, setResult] = useState(0);

  useEffect(() => {
    const totalMg = weight * dosage;
    const ml = totalMg / concentration;
    setResult(ml);
  }, [weight, concentration, dosage]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <header className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6" />
            <h3 className="font-bold text-lg">Calculadora de Dosis</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peso del Paciente</label>
              <span className="text-2xl font-black text-blue-600">{weight} <span className="text-sm">kg</span></span>
            </div>
            <input 
              type="range" min="30" max="150" step="1" 
              value={weight} onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concentración</label>
              <div className="relative">
                <input 
                  type="number" value={concentration} onChange={(e) => setConcentration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">mg/ml</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosis Objetivo</label>
              <div className="relative">
                <input 
                  type="number" step="0.1" value={dosage} onChange={(e) => setDosage(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">mg/kg</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white text-center shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Beaker size={80} /></div>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Volumen a Administrar</p>
            <h4 className="text-5xl font-black">{result.toFixed(2)} <span className="text-2xl opacity-70">ml</span></h4>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <Info className="w-5 h-5 text-orange-400 shrink-0" />
              <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                Esta herramienta es solo de apoyo clínico. Verifique siempre la dosis según el protocolo.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cerrar y Volver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosageCalculator;
