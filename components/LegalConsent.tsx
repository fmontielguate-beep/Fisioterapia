
import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';

interface LegalConsentProps {
  onConsent: () => void;
  onBack: () => void;
}

const LegalConsent: React.FC<LegalConsentProps> = ({ onConsent, onBack }) => {
  const [dni, setDni] = useState('');
  const [checked, setChecked] = useState(false);

  const isValidDni = dni.trim().length >= 8;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      {/* Botón de retorno rápido */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-widest bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Volver al Menú</span>
      </button>

      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">Acceso y Privacidad</h2>
          <p className="text-blue-100 mt-2">Portal Seguro - Clínica FisioSevilla</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Lock className="w-4 h-4" />
              Protección de datos de salud
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En cumplimiento del <b>RGPD</b>, los datos recabados se tratarán con la máxima confidencialidad. 
              Sus sesiones de monitorización por IA son procesadas localmente y solo los resultados técnicos 
              son visibles para su fisioterapeuta para ajustar su plan de recuperación.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Identificación del Paciente
              </label>
              <input 
                type="text" 
                placeholder="Introduzca su DNI / NIE (ej. 12345678X)"
                className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700 transition-all"
                value={dni}
                onChange={(e) => setDni(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex items-start gap-3 p-2">
              <input 
                id="consent-check"
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <label htmlFor="consent-check" className="text-sm text-slate-700 leading-tight cursor-pointer">
                He leído y acepto los <span className="text-blue-600 underline font-medium">términos de uso</span> y la <span className="text-blue-600 underline font-medium">política de tratamiento de datos</span>.
              </label>
            </div>
          </div>

          <button 
            disabled={!checked || !isValidDni}
            onClick={onConsent}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isValidDni && checked ? <CheckCircle2 className="w-5 h-5" /> : null}
            Comenzar Tratamiento
          </button>
          
          <div className="pt-2 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Al pulsar el botón, usted otorga su consentimiento informado para el inicio de la terapia digital según el 
              <b> Real Decreto 1112/2018</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalConsent;
