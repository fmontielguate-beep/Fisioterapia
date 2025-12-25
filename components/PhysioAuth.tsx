
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  Activity, 
  Stethoscope, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Microscope, 
  BrainCircuit,
  HelpCircle,
  KeyRound,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { PhysioUser } from '../types';

interface PhysioAuthProps {
  onLogin: (user: PhysioUser) => void;
  onBack: () => void;
}

const SECURITY_QUESTIONS = [
  "¿Cuál es el nombre de tu primera mascota?",
  "¿En qué ciudad naciste?",
  "¿Cuál es el nombre de tu escuela primaria?",
  "¿Cuál es tu color favorito de la infancia?",
  "¿Cómo se llama tu modelo de coche favorito?"
];

const PhysioAuth: React.FC<PhysioAuthProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    professionalId: '',
    specialty: 'Fisioterapia Basada en la Evidencia',
    password: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: '',
    newPassword: ''
  });

  const [resetUser, setResetUser] = useState<PhysioUser | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const savedPhysios: PhysioUser[] = JSON.parse(localStorage.getItem('fisio_sevilla_auth_users') || '[]');

    if (mode === 'register') {
      if (!formData.name || !formData.professionalId || !formData.password || !formData.securityAnswer) {
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
        password: formData.password,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer.toLowerCase().trim()
      };

      localStorage.setItem('fisio_sevilla_auth_users', JSON.stringify([...savedPhysios, newUser]));
      onLogin(newUser);
    } else if (mode === 'login') {
      const user = savedPhysios.find(u => u.professionalId === formData.professionalId && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('Número de colegiado o contraseña incorrectos.');
      }
    } else if (mode === 'forgot') {
      if (resetStep === 1) {
        const user = savedPhysios.find(u => u.professionalId === formData.professionalId);
        if (user && user.securityQuestion) {
          setResetUser(user);
          setResetStep(2);
        } else {
          setError('No se encontró ningún profesional con ese ID o no tiene pregunta de seguridad configurada.');
        }
      } else {
        if (formData.securityAnswer.toLowerCase().trim() === resetUser?.securityAnswer) {
          if (!formData.newPassword) {
            setError('Por favor, introduce una nueva contraseña.');
            return;
          }
          const updatedUsers = savedPhysios.map(u => 
            u.professionalId === resetUser.professionalId 
              ? { ...u, password: formData.newPassword } 
              : u
          );
          localStorage.setItem('fisio_sevilla_auth_users', JSON.stringify(updatedUsers));
          setSuccess('Contraseña restablecida correctamente.');
          setTimeout(() => {
            setMode('login');
            setResetStep(1);
            setResetUser(null);
            setFormData({ ...formData, password: '', newPassword: '', securityAnswer: '' });
          }, 2000);
        } else {
          setError('La respuesta a la pregunta de seguridad es incorrecta.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 animate-in zoom-in duration-500">
        <header className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
          </div>
          
          <div className="relative z-10">
            {/* Círculo indicador de paso para recuperación de cuenta */}
            {mode === 'forgot' ? (
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                   <circle 
                    cx="48" cy="48" r="40" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={251.2} 
                    strokeDashoffset={251.2 * (1 - resetStep / 2)} 
                    strokeLinecap="round"
                    className="text-blue-400 transition-all duration-700 ease-in-out" 
                   />
                 </svg>
                 <div className="absolute text-center">
                    <span className="block text-2xl font-black">{resetStep}</span>
                    <span className="block text-[8px] font-black uppercase tracking-widest opacity-60">Paso</span>
                 </div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20 transition-transform hover:scale-105 duration-300">
                <Stethoscope size={40} className="text-white" />
              </div>
            )}
            
            <h2 className="text-3xl font-black tracking-tight">
              {mode === 'login' ? 'Portal Clínico' : mode === 'register' ? 'Registro Clínico' : 'Recuperar Acceso'}
            </h2>
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

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          {mode === 'forgot' && resetStep === 2 && resetUser && (
            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 space-y-3 mb-4">
              <div className="flex items-center gap-2 text-blue-700">
                <HelpCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Pregunta de Seguridad</span>
              </div>
              <p className="text-sm font-bold text-slate-700 italic">"{resetUser.securityQuestion}"</p>
            </div>
          )}

          <div className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre y Apellidos</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="Ej. Manuel García López"
                />
              </div>
            )}

            {(mode !== 'forgot' || resetStep === 1) && (
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
            )}

            {mode === 'login' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contraseña</label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[9px] font-black text-emerald-600 uppercase hover:underline">¿Olvidaste tu contraseña?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pregunta de Seguridad</label>
                  <select 
                    value={formData.securityQuestion}
                    onChange={e => setFormData({...formData, securityQuestion: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm"
                  >
                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Respuesta de Seguridad</label>
                  <input 
                    type="text" 
                    value={formData.securityAnswer}
                    onChange={e => setFormData({...formData, securityAnswer: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                    placeholder="Tu respuesta secreta"
                  />
                </div>
              </>
            )}

            {mode === 'forgot' && resetStep === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Respuesta a la pregunta</label>
                  <input 
                    type="text" 
                    value={formData.securityAnswer}
                    onChange={e => setFormData({...formData, securityAnswer: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                    placeholder="Respuesta"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={formData.newPassword}
                      onChange={e => setFormData({...formData, newPassword: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                      placeholder="Nueva contraseña"
                    />
                    <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            type="submit"
            className={`w-full text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${mode === 'forgot' ? 'bg-blue-600 shadow-blue-100 hover:bg-blue-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'}`}
          >
            {mode === 'login' ? 'Acceder al Panel Clínico' : mode === 'register' ? 'Finalizar Registro' : resetStep === 1 ? 'Siguiente' : 'Restablecer Contraseña'}
            <ArrowRight size={18} />
          </button>

          <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
            {mode === 'forgot' ? (
              <button 
                type="button" 
                onClick={() => { setMode('login'); setResetStep(1); }}
                className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600"
              >
                <ChevronLeft size={14} /> Volver al Inicio de Sesión
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:underline text-center"
              >
                {mode === 'login' ? '¿Primera vez? Crear cuenta clínica' : '¿Ya tienes acceso? Inicia sesión'}
              </button>
            )}
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
