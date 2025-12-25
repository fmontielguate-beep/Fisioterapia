
import React from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ArrowLeft, Home, User } from 'lucide-react';
import { PatientInfo } from '../types';

interface ClinicalCalendarProps {
  onClose: () => void;
  patients: PatientInfo[];
  onSelectPatient: (patient: PatientInfo) => void;
}

const ClinicalCalendar: React.FC<ClinicalCalendarProps> = ({ onClose, patients, onSelectPatient }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Generamos citas ficticias basadas en los pacientes reales para que sea funcional
  const mockAppointments = patients.map((p, index) => ({
    time: `${9 + index}:00`,
    patient: p,
    type: index % 2 === 0 ? 'Tratamiento' : 'Revisión',
    color: index % 2 === 0 ? 'bg-green-500' : 'bg-blue-500'
  })).slice(0, 6);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-5xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row h-[90vh] md:h-[700px]">
        
        {/* Sidebar de Agenda */}
        <aside className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Citas de Hoy</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-6">
            {mockAppointments.length > 0 ? (
              mockAppointments.map((app, idx) => (
                <AppointmentItem 
                  key={app.patient.id + idx}
                  time={app.time} 
                  patientName={app.patient.name} 
                  type={app.type} 
                  color={app.color} 
                  onClick={() => onSelectPatient(app.patient)}
                />
              ))
            ) : (
              <div className="py-10 text-center space-y-3 opacity-40">
                <User className="mx-auto text-slate-400" size={32} />
                <p className="text-xs font-bold text-slate-500">No hay citas registradas</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
             <button 
              onClick={onClose}
              className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver al Panel</span>
            </button>
          </div>
        </aside>

        {/* Cuerpo del Calendario */}
        <main className="flex-1 p-8 flex flex-col bg-white">
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
               <button 
                onClick={onClose}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-xs uppercase tracking-widest group"
              >
                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <Home className="w-4 h-4" />
                </div>
                <span>Inicio</span>
              </button>
              <div className="h-8 w-px bg-slate-100"></div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sede Central Sevilla</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button className="p-2.5 hover:bg-white rounded-xl transition-all shadow-sm text-slate-400 hover:text-blue-600"><ChevronLeft size={20} /></button>
                <button className="p-2.5 hover:bg-white rounded-xl transition-all shadow-sm text-slate-400 hover:text-blue-600"><ChevronRight size={20} /></button>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner">
            {weekDays.map(d => (
              <div key={d} className="bg-slate-50/80 p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{d}</div>
            ))}
            {days.map(d => {
              const isToday = d === new Date().getDate();
              return (
                <div 
                  key={d} 
                  className={`bg-white p-5 group cursor-pointer transition-all hover:bg-blue-50/30 relative flex flex-col items-center justify-start min-h-[80px] ${isToday ? 'bg-blue-50/50' : ''}`}
                >
                  <span className={`text-base font-bold transition-all group-hover:scale-110 ${isToday ? 'text-blue-600' : 'text-slate-600'}`}>{d}</span>
                  <div className="mt-2 flex gap-1">
                    {d % 7 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                    {d % 10 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                    {d % 4 === 0 && d % 7 !== 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>}
                  </div>
                  {isToday && <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600 text-[8px] text-white font-black rounded uppercase">Hoy</div>}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppointmentItem = ({ time, patientName, type, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group active:scale-95"
  >
    <div className="flex items-center gap-2 mb-2">
      <Clock size={12} className="text-slate-400" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{time}</span>
    </div>
    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{patientName}</h4>
    <div className="flex items-center gap-2 mt-3">
      <div className={`w-2 h-2 rounded-full ${color} shadow-sm`}></div>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
    </div>
  </div>
);

export default ClinicalCalendar;
