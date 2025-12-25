
import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { getPhysioFeedback } from '../services/geminiService';
import { JointAngles } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Monitoring: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState('Prepárate para iniciar tu ejercicio...');
  const [isLoading, setIsLoading] = useState(false);
  const [dataHistory, setDataHistory] = useState<any[]>([]);
  const [currentAngles, setCurrentAngles] = useState<JointAngles>({ shoulder: 0, elbow: 0, hip: 0, knee: 0 });

  const intervalRef = useRef<number | null>(null);

  const startSession = () => {
    setIsActive(true);
    setFeedback("Analizando tu postura...");
    
    // Simulate real-time data flow
    intervalRef.current = window.setInterval(() => {
      const newAngles = {
        shoulder: 30 + Math.random() * 20,
        elbow: 45 + Math.random() * 15,
        hip: 90 + Math.random() * 10,
        knee: 120 + Math.random() * 30,
      };
      setCurrentAngles(newAngles);
      setDataHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), knee: newAngles.knee }]);
    }, 1000);
  };

  const stopSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setFeedback("Sesión terminada. ¡Buen trabajo!");
  };

  const requestFeedback = async () => {
    if (!isActive) return;
    setIsLoading(true);
    const result = await getPhysioFeedback(currentAngles, "Flexión de Rodilla");
    setFeedback(result);
    setIsLoading(false);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Monitorización IA</h2>
          <p className="text-slate-500">Feedback en tiempo real de tus movimientos.</p>
        </div>
        <div className={`px-4 py-1 rounded-full flex items-center gap-2 ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-600 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="text-xs font-bold uppercase tracking-widest">{isActive ? 'En Sesión' : 'Inactivo'}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Monitoring / Camera area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center group">
            {isActive ? (
              <>
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">Knee: {currentAngles.knee.toFixed(1)}°</span>
                  <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">Hip: {currentAngles.hip.toFixed(1)}°</span>
                </div>
                {/* Skeleton mockup */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-1/2 h-4/5 border-2 border-green-500/30 rounded-full flex flex-col items-center justify-start p-4">
                       <div className="w-12 h-12 rounded-full bg-green-500/50 mb-2"></div>
                       <div className="w-1 h-32 bg-green-500/50"></div>
                       <div className="w-24 h-1 bg-green-500/50"></div>
                    </div>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="text-slate-600 w-8 h-8" />
                </div>
                <p className="text-slate-500 font-medium">Pulsa comenzar para iniciar la cámara</p>
              </div>
            )}
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              {!isActive ? (
                <button 
                  onClick={startSession}
                  className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-600 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Comenzar Rutina
                </button>
              ) : (
                <button 
                  onClick={stopSession}
                  className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-600 transition-all"
                >
                  Detener
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4">Ángulos de Articulación (Tendencia)</h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 180]} hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="knee" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="space-y-4">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 flex flex-col h-full min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Asistente Virtual</h3>
            </div>
            
            <div className="flex-1 bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20 mb-6 flex flex-col items-center justify-center text-center">
              {isLoading ? (
                <div className="space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto opacity-50" />
                  <p className="text-blue-100 text-sm italic">Analizando postura con IA...</p>
                </div>
              ) : (
                <p className="text-xl font-medium leading-relaxed">
                  "{feedback}"
                </p>
              )}
            </div>

            <button 
              disabled={!isActive || isLoading}
              onClick={requestFeedback}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pedir Consejo IA
            </button>
            <p className="text-[10px] text-blue-200 mt-4 text-center">
              IA de apoyo basada en protocolos de la clínica FisioSevilla.
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex gap-3">
             <CheckCircle2 className="text-green-600 shrink-0" />
             <div>
               <p className="text-sm font-bold text-green-800">Calidad de Movimiento</p>
               <p className="text-xs text-green-700">Tu rango está en zona óptima (115° - 145°)</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
