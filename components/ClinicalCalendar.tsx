
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ArrowLeft, Home, User, Plus, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { PatientInfo, Appointment } from '../types';

interface ClinicalCalendarProps {
  onClose: () => void;
  patients: PatientInfo[];
  appointments: Appointment[];
  onAddAppointment: (appt: Appointment) => void;
  onSelectPatient: (patient: PatientInfo) => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const ClinicalCalendar: React.FC<ClinicalCalendarProps> = ({ onClose, patients, appointments, onAddAppointment, onSelectPatient }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Tratamiento' as any
  });

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Obtener días del mes y día de inicio de semana
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Ajustar para que Lunes sea el primer día (0: Dom, 1: Lun...) -> (Lun: 0, Dom: 6)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const filteredAppointments = appointments.filter(a => {
    const apptDate = new Date(a.date);
    return (
      apptDate.getDate() === selectedDay &&
      apptDate.getMonth() === currentMonth &&
      apptDate.getFullYear() === currentYear
    );
  }).sort((a, b) => a.time.localeCompare(b.time));

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newAppt.patientId);
    if (!patient) return;

    const appt: Appointment = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      date: newAppt.date,
      time: newAppt.time,
      type: newAppt.type
    };

    onAddAppointment(appt);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-6xl rounded-[2rem] sm:rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row h-[95vh] md:h-[80vh] max-h-[850px]">
        
        {/* Sidebar de Citas */}
        <aside className="w-full md:w-80 lg:w-96 bg-slate-50 border-r border-slate-100 p-4 sm:p-8 flex flex-col h-auto md:h-full shrink-0">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl shadow-lg">
                <CalendarIcon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">{selectedDay} {MONTHS[currentMonth]}</h3>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest">Agenda Diaria</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="p-2 sm:p-3 bg-emerald-500 text-white rounded-lg sm:rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto no-scrollbar pb-4 max-h-[200px] md:max-h-full">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => {
                    const p = patients.find(pat => pat.id === app.patientId);
                    if (p) onSelectPatient(p);
                  }}
                  className="p-3 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock size={10} className="text-blue-500 sm:w-3 sm:h-3" />
                      <span className="text-[8px] sm:text-[10px] font-black text-slate-800 uppercase tracking-wider">{app.time}h</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-black uppercase ${app.type === 'Evaluación' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                      {app.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors leading-tight truncate">{app.patientName}</h4>
                </div>
              ))
            ) : (
              <div className="py-10 md:py-20 text-center space-y-2 sm:space-y-3 opacity-30">
                <CalendarPlus className="mx-auto text-slate-400 w-8 h-8 sm:w-12 sm:h-12" />
                <p className="text-[10px] sm:text-xs font-bold text-slate-500">Sin citas para hoy</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-100">
             <button onClick={onClose} className="w-full bg-white text-slate-600 border border-slate-200 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> <span>Volver</span>
            </button>
          </div>
        </aside>

        {/* Cuerpo del Calendario o Formulario */}
        <main className="flex-1 p-4 sm:p-8 flex flex-col bg-white overflow-hidden">
          {showAddForm ? (
            <div className="max-w-md mx-auto w-full py-4 sm:py-10 animate-in slide-in-from-right duration-300 overflow-y-auto">
               <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                 <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft size={18} className="sm:w-5 sm:h-5"/></button>
                 <h2 className="text-xl sm:text-3xl font-black text-slate-800">Nueva Cita</h2>
               </div>
               <form onSubmit={handleCreateAppointment} className="space-y-4 sm:space-y-6">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</label>
                    <select 
                      required
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={newAppt.patientId}
                      onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                    >
                      <option value="">Seleccionar...</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</label>
                      <input type="date" className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none text-sm" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</label>
                      <input type="time" className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none text-sm" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Sesión</label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {['Tratamiento', 'Revisión', 'Evaluación', 'Domicilio'].map(t => (
                        <button 
                          key={t} type="button" 
                          onClick={() => setNewAppt({...newAppt, type: t as any})}
                          className={`py-2 sm:py-3 rounded-lg sm:rounded-xl border text-[8px] sm:text-[10px] font-black uppercase transition-all ${newAppt.type === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 sm:py-5 bg-blue-600 text-white rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all mt-4">
                    <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" /> Confirmar Cita
                  </button>
               </form>
            </div>
          ) : (
            <>
              <header className="flex flex-wrap justify-between items-center mb-4 sm:mb-10 gap-2">
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight">{MONTHS[currentMonth]} {currentYear}</h2>
                  <p className="text-blue-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-0.5 sm:mt-1">Citas y Planificación Clínica</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl sm:p-1.5 sm:rounded-2xl border border-slate-100">
                  <button onClick={handlePrevMonth} className="p-1.5 sm:p-2.5 hover:bg-white rounded-lg sm:rounded-xl transition-all shadow-sm text-slate-600"><ChevronLeft size={16} className="sm:w-5 sm:h-5" /></button>
                  <button onClick={handleNextMonth} className="p-1.5 sm:p-2.5 hover:bg-white rounded-lg sm:rounded-xl transition-all shadow-sm text-slate-600"><ChevronRight size={16} className="sm:w-5 sm:h-5" /></button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div className="grid grid-cols-7 gap-px bg-slate-100 min-w-[500px]">
                  {weekDays.map(d => <div key={d} className="bg-slate-50/80 p-2 sm:p-5 text-center text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{d}</div>)}
                  
                  {/* Celdas vacías para el inicio del mes */}
                  {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-slate-50/30 p-2 sm:p-5 min-h-[60px] sm:min-h-[100px]"></div>
                  ))}

                  {/* Días del mes */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const hasAppts = appointments.some(a => {
                      const apptDate = new Date(a.date);
                      return apptDate.getDate() === d && apptDate.getMonth() === currentMonth && apptDate.getFullYear() === currentYear;
                    });
                    const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

                    return (
                      <div 
                        key={d} 
                        onClick={() => setSelectedDay(d)}
                        className={`bg-white p-2 sm:p-5 group cursor-pointer transition-all hover:bg-blue-50/30 relative flex flex-col items-center justify-start min-h-[60px] sm:min-h-[100px] ${selectedDay === d ? 'bg-blue-50/50' : ''}`}
                      >
                        <span className={`text-xs sm:text-base font-bold transition-all group-hover:scale-110 ${selectedDay === d ? 'text-blue-600' : isToday ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {d}
                        </span>
                        {hasAppts && <div className="mt-1 sm:mt-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-200"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClinicalCalendar;
