
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Activity, 
  UserPlus, 
  FolderOpen, 
  ChevronRight, 
  Save, 
  RefreshCw,
  TrendingUp,
  CalendarDays,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { PatientInfo } from '../types';

interface PhysioDashboardProps {
  patients: PatientInfo[];
  onSelectPatient: (patient: PatientInfo) => void;
  onDeletePatient: (id: string) => void;
  onAddNew: () => void;
  onManualSave: () => void;
  lastSaved: string | null;
}

const PhysioDashboard: React.FC<PhysioDashboardProps> = ({ patients, onSelectPatient, onDeletePatient, onAddNew, onManualSave, lastSaved }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patientToDelete, setPatientToDelete] = useState<PatientInfo | null>(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.idNumber.includes(searchTerm) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative pb-20">
      {patientToDelete && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 tracking-tight">¿Eliminar Registro?</h3>
            <p className="text-slate-500 text-center mt-3 mb-10 text-sm leading-relaxed">
              Estás a punto de borrar la ficha de <span className="font-bold text-slate-800">{patientToDelete.name}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { onDeletePatient(patientToDelete.id); setPatientToDelete(null); }} className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-red-700 transition-all">Sí, Eliminar HCE</button>
              <button onClick={() => setPatientToDelete(null)} className="w-full bg-slate-50 text-slate-600 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Gestión de Pacientes</h2>
          <div className="flex items-center gap-2 text-slate-400">
            <RefreshCw size={12} className="animate-spin-slow" />
            <p className="text-[10px] font-black uppercase tracking-[0.1em]">Última sincronización local: {lastSaved || 'Pendiente'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onManualSave} className="p-4 bg-white text-blue-600 border border-slate-100 rounded-2xl hover:bg-blue-50 transition-all shadow-sm" title="Guardar Base de Datos"><Save className="w-6 h-6" /></button>
          <button onClick={onAddNew} className="bg-blue-600 text-white px-8 py-4 rounded-[2.2rem] font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl active:scale-95 whitespace-nowrap"><UserPlus className="w-5 h-5" /> <span>Nueva Ficha</span></button>
        </div>
      </header>

      <div className="relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
        <input type="text" placeholder="Buscar por nombre, DNI o patología..." className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-100 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPatients.map((p) => (
          <div key={p.id} className="group bg-white border border-slate-100 rounded-[3rem] p-8 hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-2xl flex flex-col relative overflow-hidden active:scale-[0.98]" onClick={() => onSelectPatient(p)}>
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">{p.name.charAt(0)}</div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-800 text-lg truncate leading-tight">{p.name}</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{p.idNumber}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setPatientToDelete(p); }} className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
            </div>
            <div className="space-y-4 flex-1 relative z-10">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{p.condition}</span>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide"><CalendarDays size={14} className="text-blue-400" /><span>Ingreso: {p.admissionDate}</span></div>
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 group-hover:bg-blue-50 transition-colors mt-2"><p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{p.diagnosis || 'Sin diagnóstico detallado.'}"</p></div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
              <div className="flex-1 mr-4">
                <div className="flex justify-between items-center mb-2"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Progreso</span><span className="text-xs font-black text-blue-600">{p.progress}%</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div></div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><FolderOpen size={20} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhysioDashboard;
