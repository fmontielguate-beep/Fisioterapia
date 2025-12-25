
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

const ClinicalCalendar: React.FC<ClinicalCalendarProps> = ({ onClose, patients, appointments, onAddAppointment, onSelectPatient }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Tratamiento' as any
  });

  const daysInMonth = 31; // Simplificado para demo
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const filteredAppointments = appointments.filter(a => {
    const apptDate = new Date(a.date);
    return apptDate.getDate() === selectedDay;
  }).sort((a, b) => a.time.localeCompare(b.time));

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
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-6xl rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row h-[90vh] md:h-[750px]">
        
        {/* Sidebar de Citas */}
        <aside className="w-full md:w-96 bg-slate-50 border-r border-slate-100 p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Día {selectedDay}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Agenda Diaria</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => {
                    const p = patients.find(pat => pat.id === app.patientId);
                    if (p) onSelectPatient(p);
                  }}
                  className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-blue-500" />
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{app.time}h</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${app.type === 'Evaluación' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                      {app.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{app.patientName}</h4>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3 opacity-30">
                <CalendarPlus className="mx-auto text-slate-400" size={48} />
                <p className="text-xs font-bold text-slate-500">Sin citas para hoy</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
             <button onClick={onClose} className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4" /> <span>Volver</span>
            </button>
          </div>
        </aside>

        {/* Cuerpo del Calendario o Formulario */}
        <main className="flex-1 p-8 flex flex-col bg-white overflow-y-auto">
          {showAddForm ? (
            <div className="max-w-md mx-auto w-full py-10 animate-in slide-in-from-right duration-300">
               <div className="flex items-center gap-4 mb-10">
                 <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft size={20}/></button>
                 <h2 className="text-3xl font-black text-slate-800">Nueva Cita</h2>
               </div>
               <form onSubmit={handleCreateAppointment} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</label>
                    <select 
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      value={newAppt.patientId}
                      onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                    >
                      <option value="">Seleccionar...</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</label>
                      <input type="date" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</label>
                      <input type="time" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Sesión</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Tratamiento', 'Revisión', 'Evaluación', 'Domicilio'].map(t => (
                        <button 
                          key={t} type="button" 
                          onClick={() => setNewAppt({...newAppt, type: t as any})}
                          className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${newAppt.type === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                    <CheckCircle2 size={18} /> Confirmar Cita
                  </button>
               </form>
            </div>
          ) : (
            <>
              <header className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Citas Clínica Sevilla</h2>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sincronizado Localmente</p>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button className="p-2.5 hover:bg-white rounded-xl transition-all shadow-sm text-slate-400"><ChevronLeft size={20} /></button>
                  <button className="p-2.5 hover:bg-white rounded-xl transition-all shadow-sm text-slate-400"><ChevronRight size={20} /></button>
                </div>
              </header>

              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner flex-1">
                {weekDays.map(d => <div key={d} className="bg-slate-50/80 p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{d}</div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const hasAppts = appointments.some(a => new Date(a.date).getDate() === d);
                  return (
                    <div 
                      key={d} 
                      onClick={() => setSelectedDay(d)}
                      className={`bg-white p-5 group cursor-pointer transition-all hover:bg-blue-50/30 relative flex flex-col items-center justify-start min-h-[100px] ${selectedDay === d ? 'bg-blue-50/50' : ''}`}
                    >
                      <span className={`text-base font-bold transition-all group-hover:scale-110 ${selectedDay === d ? 'text-blue-600' : 'text-slate-600'}`}>{d}</span>
                      {hasAppts && <div className="mt-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-200"></div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClinicalCalendar;
