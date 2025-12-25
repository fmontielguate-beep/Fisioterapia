
import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  FolderOpen, 
  Save, 
  RefreshCw,
  CalendarDays,
  Trash2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { PatientInfo } from '../types';

interface PhysioDashboardProps {
  patients: PatientInfo[];
  onSelectPatient: (patient: PatientInfo) => void;
  onDeletePatient: (id: string) => void;
  onAddNew: () => void;
  onManualSave: () => void;
  lastSaved: string | null;
  onBack?: () => void;
}

const PhysioDashboard: React.FC<PhysioDashboardProps> = ({ patients, onSelectPatient, onDeletePatient, onAddNew, onManualSave, lastSaved, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.idNumber.includes(searchTerm) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-bold text-[10px] uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Menú Principal</span>
          </button>
        )}
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Gestión Clínica</h2>
            <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-200">v2.5.2 PRO</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <RefreshCw size={12} className="animate-spin-slow" />
            <p className="text-[10px] font-black uppercase tracking-[0.1em]">Sincronizado: {lastSaved || 'Reciente'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onManualSave} className="p-4 bg-white text-emerald-600 border border-slate-100 rounded-2xl hover:bg-emerald-50 transition-all shadow-sm"><Save className="w-6 h-6" /></button>
          <button onClick={onAddNew} className="bg-emerald-600 text-white px-8 py-4 rounded-[2.2rem] font-bold flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"><UserPlus className="w-5 h-5" /> <span>Nueva Ficha</span></button>
        </div>
      </header>

      <div className="relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
        <input type="text" placeholder="Buscar por nombre, DNI o patología..." className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-100 bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPatients.map((p) => (
            <div key={p.id} className="group bg-white border border-slate-100 rounded-[3rem] p-8 hover:border-emerald-200 transition-all cursor-pointer shadow-sm hover:shadow-2xl flex flex-col relative overflow-hidden" onClick={() => onSelectPatient(p)}>
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white text-2xl font-black shadow-lg">{p.name.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{p.idNumber}</p>
                </div>
              </div>
              <div className="space-y-4 flex-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{p.condition}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide"><CalendarDays size={14} className="text-emerald-400" /><span>Ingreso: {p.admissionDate}</span></div>
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 group-hover:bg-emerald-50 transition-colors"><p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{p.diagnosis}"</p></div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between items-center mb-2"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Progreso</span><span className="text-xs font-black text-emerald-600">{p.progress}%</span></div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div></div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all"><FolderOpen size={20} /></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
           <AlertTriangle className="mx-auto text-slate-200 mb-4" size={48} />
           <p className="text-slate-400 font-bold">No se encontraron pacientes para tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default PhysioDashboard;
