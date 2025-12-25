
import React, { useState } from 'react';
import { ShieldCheck, Lock, UserCheck, ArrowRight, Activity, Stethoscope, Eye, EyeOff, UserPlus, Microscope, BrainCircuit } from 'lucide-react';
import { PhysioUser } from '../types';

interface PhysioAuthProps {
  onLogin: (user: PhysioUser) => void;
  onBack: () => void;
}

const PhysioAuth: React.FC<PhysioAuthProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    professionalId: '',
    specialty: 'Fisioterapia Basada en la Evidencia',
    password: ''
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedPhysios: PhysioUser[] = JSON.parse(localStorage.getItem('fisio_sevilla_auth_users') || '[]');

    if (mode === 'register') {
      if (!formData.name || !formData.professionalId || !formData.password) {
        setError('Por favor, rellena todos los campos obligatorios.');
        return;
      }
      
      const exists = savedPhysios.find(u => u.professionalId === formData.professionalId);
      if (exists) {
        setError('Este número de colegiado/DNI ya está registrado.');
        return;
      }

      const newUser: PhysioUser = {
        id: Date.now().toString(),
        name: formData.name,
        professionalId: formData.professionalId,
        specialty: formData.specialty,
        password: formData.password
      };

      localStorage.setItem('fisio_sevilla_auth_users', JSON.stringify([...savedPhysios, newUser]));
      onLogin(newUser);
    } else {
      const user = savedPhysios.find(u => u.professionalId === formData.professionalId && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('Número de colegiado o contraseña incorrectos.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Elementos decorativos de fondo científicos */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <header className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
          {/* Patrón de fondo geométrico sutil */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20 transition-transform hover:scale-105 duration-300">
              <Stethoscope size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">{mode === 'login' ? 'Portal Clínico' : 'Registro Científico'}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
               <div className="h-px w-4 bg-emerald-500"></div>
               <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Ciencia y Salud · Sevilla</p>
               <div className="h-px w-4 bg-emerald-500"></div>
            </div>
          </div>
        </header>

        <form onSubmit={handleAuth} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
              <ShieldCheck size={16} />
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre y Apellidos</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="Ej. Manuel García López"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nº Colegiado / Credencial</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.professionalId}
                onChange={e => setFormData({...formData, professionalId: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                placeholder="ID Profesional Único"
              />
              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Encriptada</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            {mode === 'login' ? 'Acceder al Panel Clínico' : 'Finalizar Registro'}
            <ArrowRight size={18} />
          </button>

          <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
            <button 
              type="button" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:underline text-center"
            >
              {mode === 'login' ? '¿Primera vez? Crear cuenta clínica' : '¿Ya tienes acceso? Inicia sesión'}
            </button>
            <div className="flex items-center justify-center gap-4 opacity-40 grayscale">
              <Microscope size={16} />
              <BrainCircuit size={16} />
              <Activity size={16} />
            </div>
            <button 
              type="button" 
              onClick={onBack}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 text-center"
            >
              Cerrar portal profesional
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhysioAuth;
