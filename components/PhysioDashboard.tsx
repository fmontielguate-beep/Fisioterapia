
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Activity, 
  UserPlus, 
  FolderOpen, 
  ChevronRight, 
  MapPin, 
  Move, 
  Calculator, 
  Calendar as CalendarIcon, 
  Save, 
  RefreshCw,
  TrendingUp,
  CalendarDays,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { PatientInfo } from '../types';
import DosageCalculator from './DosageCalculator';
import ClinicalCalendar from './ClinicalCalendar';

interface PhysioDashboardProps {
  patients: PatientInfo[];
  onSelectPatient: (patient: PatientInfo) => void;
  onDeletePatient: (id: string) => void;
  onAddNew: () => void;
  onManualSave: () => void;
  lastSaved: string | null;
}

const PhysioDashboard: React.FC<PhysioDashboardProps> = ({ patients, onSelectPatient, onDeletePatient, onAddNew, onManualSave, lastSaved }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientToDelete, setPatientToDelete] = useState<PatientInfo | null>(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.idNumber.includes(searchTerm) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (patientToDelete) {
      onDeletePatient(patientToDelete.id);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative pb-20">
      {showCalculator && <DosageCalculator onClose={() => setShowCalculator(false)} />}
      {showCalendar && (
        <ClinicalCalendar 
          onClose={() => setShowCalendar(false)} 
          patients={patients}
          onSelectPatient={(p) => {
            setShowCalendar(false);
            onSelectPatient(p);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {patientToDelete && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-800 tracking-tight">¿Eliminar Registro?</h3>
            <p className="text-slate-500 text-center mt-3 mb-10 text-sm leading-relaxed">
              Estás a punto de eliminar permanentemente la HCE de <span className="font-bold text-slate-800">{patientToDelete.name}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={confirmDelete} 
                className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
              >
                Sí, Eliminar Permanentemente
              </button>
              <button 
                onClick={() => setPatientToDelete(null)} 
                className="w-full bg-slate-50 text-slate-600 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest"
              >
                Cancelar Acción
              </button>
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
          <div className="flex items-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-1.5 overflow-hidden">
             <button 
              onClick={() => setShowCalculator(true)}
              className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
              title="Calculadora Médica"
            >
              <Calculator className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setShowCalendar(true)}
              className="p-3 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
              title="Agenda de Citas"
            >
              <CalendarIcon className="w-6 h-6" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button 
              onClick={onManualSave}
              className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
              title="Guardar Base de Datos"
            >
              <Save className="w-6 h-6" />
            </button>
          </div>
          
          <button 
            onClick={onAddNew}
            className="bg-blue-600 text-white px-8 py-4 rounded-[2.2rem] font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </header>

      <div className="relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar paciente por nombre, DNI o patología..."
          className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur-md focus:ring-2 focus:ring-blue-500 outline-none font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-[3.5rem] p-24 text-center border border-white/20 shadow-xl space-y-6">
          <div className="w-24 h-24 bg-blue-50/50 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
            <Users className="text-blue-300 w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">No se encontraron pacientes</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Prueba a cambiar los términos de búsqueda o registra un nuevo paciente.</p>
          <button onClick={onAddNew} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all">Crear Nueva HCE</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPatients.map((p) => (
            <div 
              key={p.id} 
              className="group bg-white/50 backdrop-blur-xl border border-white/40 rounded-[3rem] p-8 hover:bg-white hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-2xl flex flex-col relative overflow-hidden active:scale-[0.98]"
              onClick={() => onSelectPatient(p)}
              role="button"
              tabIndex={0}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:rotate-6 transition-transform">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-lg truncate group-hover:text-blue-600 transition-colors leading-tight">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1">{p.idNumber}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatientToDelete(p);
                  }}
                  className="p-3 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar Paciente"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4 flex-1 relative z-10">
                <div className="flex flex-wrap gap-2">
                   <span className="bg-blue-50 text-blue-700 border border-blue-100/50 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {p.condition}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${p.patientType === 'Intrahospitalario' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-500'}`}>
                    {p.patientType}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    <CalendarDays size={14} className="text-blue-400" />
                    <span>Ingreso: {new Date(p.admissionDate).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span className="text-emerald-600">Respuesta: {p.treatmentResponse || 'Pendiente evaluar'}</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 group-hover:bg-blue-50/50 transition-colors mt-2">
                  <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{p.diagnosis || 'Sin diagnóstico detallado registrado.'}"</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2 pr-4">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Estado Recuperación</span>
                    <span className="text-xs font-black text-blue-600">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-blue-500 rounded-full shadow-sm transition-all duration-1000 ease-out" 
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-200 group-hover:-translate-y-1">
                  <FolderOpen size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhysioDashboard;
