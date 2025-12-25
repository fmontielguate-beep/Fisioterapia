
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clipboard, 
  Stethoscope, 
  Activity, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  Heart,
  Wind,
  Thermometer,
  AlertTriangle,
  Beaker,
  Zap,
  Layers,
  Search,
  Check,
  Edit2,
  Home,
  ShieldAlert,
  Info,
  Save,
  BookOpen,
  ClipboardList,
  Pill,
  GraduationCap,
  X,
  Clock,
  User
} from 'lucide-react';
import { PatientInfo, DiagnosticType, ClinicalNote, VitalSigns } from '../types';

interface ClinicalRecordProps {
  patient: PatientInfo;
  onBack: () => void;
  onManagePlan: () => void;
  onUpdatePatient: (patient: PatientInfo) => void;
}

const ClinicalRecord: React.FC<ClinicalRecordProps> = ({ patient, onBack, onManagePlan, onUpdatePatient }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'exercises' | 'diagnostics'>('summary');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteType, setNoteType] = useState<'Evolución' | 'Plan de Trabajo'>('Evolución');
  
  // Helper to get current date in datetime-local format
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Form State for new note
  const [newNote, setNewNote] = useState({
    date: getCurrentDateTimeLocal(),
    content: '',
    painLevel: 5,
    hr: patient.vitalSigns.heartRate.toString(),
    bp: patient.vitalSigns.bloodPressure,
    spo2: patient.vitalSigns.oxygenSaturation.toString(),
    temp: patient.vitalSigns.temperature.toString()
  });

  const tabs = [
    { id: 'summary', label: 'Resumen Clínico', icon: Stethoscope },
    { id: 'diagnostics', label: 'Estudios / Pruebas', icon: FileText },
    { id: 'notes', label: 'Evolución', icon: Clipboard },
    { id: 'exercises', label: 'Plan de Trabajo', icon: Activity },
  ];

  const handleAddNoteClick = (type: 'Evolución' | 'Plan de Trabajo') => {
    setNoteType(type);
    setNewNote(prev => ({ ...prev, date: getCurrentDateTimeLocal() }));
    setIsAddingNote(true);
  };

  const handleSaveNote = () => {
    const vitalSigns: VitalSigns = {
      heartRate: parseInt(newNote.hr),
      bloodPressure: newNote.bp,
      oxygenSaturation: parseInt(newNote.spo2),
      temperature: parseFloat(newNote.temp)
    };

    // Format the date for display
    const displayDate = new Date(newNote.date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const note: ClinicalNote = {
      id: Date.now().toString(),
      date: displayDate,
      content: newNote.content,
      painLevel: newNote.painLevel,
      author: 'Fisio Manuel G.',
      vitalSigns: noteType === 'Evolución' ? vitalSigns : undefined,
      type: noteType
    };

    const updatedPatient = {
      ...patient,
      notes: [note, ...patient.notes],
      lastSession: 'Hoy',
      // Update patient current vitals if it's an evolution note
      vitalSigns: noteType === 'Evolución' ? vitalSigns : patient.vitalSigns
    };

    onUpdatePatient(updatedPatient);
    setIsAddingNote(false);
    setNewNote({ ...newNote, content: '', date: getCurrentDateTimeLocal() }); 
    setActiveTab(noteType === 'Evolución' ? 'notes' : 'exercises');
  };

  const getStudyIcon = (type: DiagnosticType) => {
    switch(type) {
      case 'Sanguínea': return <Beaker className="w-5 h-5 text-red-500" />;
      case 'Neuroconducción': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Radiología': return <Layers className="w-5 h-5 text-blue-500" />;
      case 'Imagen Avanzada': return <Search className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const openScholarSearch = () => {
    const query = encodeURIComponent(`fisioterapia evidencia "${patient.diagnosis || patient.condition}"`);
    window.open(`https://scholar.google.es/scholar?q=${query}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20 relative">
      
      {/* Modal para Nueva Nota / Evolución */}
      {isAddingNote && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <header className={`p-6 text-white flex justify-between items-center ${noteType === 'Evolución' ? 'bg-blue-600' : 'bg-green-600'}`}>
              <div className="flex items-center gap-3">
                {noteType === 'Evolución' ? <Clipboard size={24} /> : <Activity size={24} />}
                <div>
                  <h3 className="font-bold text-lg">Nueva Nota de {noteType}</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-70">{patient.name}</p>
                </div>
              </div>
              <button onClick={() => setIsAddingNote(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </header>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <section className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha y Hora de la Nota</h4>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input 
                    type="datetime-local" 
                    value={newNote.date}
                    onChange={(e) => setNewNote({...newNote, date: e.target.value})}
                    className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                  />
                </div>
              </section>

              {noteType === 'Evolución' && (
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constantes Vitales en Sesión</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <VitalInput label="FC (lpm)" value={newNote.hr} onChange={(v) => setNewNote({...newNote, hr: v})} />
                    <VitalInput label="TA (mmHg)" value={newNote.bp} onChange={(v) => setNewNote({...newNote, bp: v})} />
                    <VitalInput label="SatO2 (%)" value={newNote.spo2} onChange={(v) => setNewNote({...newNote, spo2: v})} />
                    <VitalInput label="Temp (ºC)" value={newNote.temp} onChange={(v) => setNewNote({...newNote, temp: v})} />
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nivel de Dolor (EVA 1-10)</h4>
                  <span className="text-xl font-black text-blue-600">{newNote.painLevel}</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={newNote.painLevel} 
                  onChange={(e) => setNewNote({...newNote, painLevel: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </section>

              <section className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Razonamiento Clínico / Observaciones</h4>
                <textarea 
                  rows={5}
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder={noteType === 'Evolución' ? "Describa la evolución del paciente, cambios en la sintomatología..." : "Anotaciones sobre la técnica, progresión de cargas o modificaciones del plan..."}
                  className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                ></textarea>
              </section>
            </div>

            <footer className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={() => setIsAddingNote(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancelar</button>
              <button onClick={handleSaveNote} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Save size={18} /> Guardar Nota Clínica
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Barra de Navegación del Paciente */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-lg p-4 rounded-3xl border border-white/40 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-50 transition-colors border border-slate-100"><ArrowLeft className="w-4 h-4" /></div>
            <span>Volver</span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-green-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
             <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-green-50 transition-colors border border-slate-100"><Home className="w-4 h-4" /></div>
            <span>Inicio</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleAddNoteClick('Plan de Trabajo')} className="bg-green-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2 shadow-xl shadow-green-100">
            <Activity size={14} /> Nota Plan
          </button>
          <button onClick={() => handleAddNoteClick('Evolución')} className="bg-slate-800 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl">
            <Plus size={14} /> Evolución
          </button>
        </div>
      </div>

      {/* Cabecera del Paciente */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col lg:flex-row justify-between items-stretch gap-8 relative overflow-hidden">
        <div className="flex items-center gap-6 flex-1 z-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black shadow-lg">
            {patient.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-slate-800 truncate">{patient.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${patient.patientType === 'Intrahospitalario' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {patient.patientType}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100"><FileText size={12} /> {patient.idNumber}</div>
              <div className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100"><Calendar size={12} /> {patient.age} años</div>
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-green-100"><Activity size={12} /> {patient.condition}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6 min-w-[320px] z-10">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
             <svg className="w-full h-full -rotate-90">
               <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200" />
               <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175.8} strokeDashoffset={175.8 * (1 - patient.progress / 100)} className="text-blue-600 transition-all duration-500 ease-out" />
             </svg>
             <span className="absolute text-sm font-black text-slate-800">{patient.progress}%</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recuperación</p>
            <p className="text-sm font-bold text-slate-700">Fase Actual: {patient.progress > 70 ? 'Readaptación' : 'Consolidación'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30 rounded-t-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-t-xl'}`}><Icon className="w-4 h-4" /> {tab.label}</button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Historia del Padecimiento Actual (Fisio) */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col border-l-8 border-l-blue-600">
                <div className="bg-blue-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-lg"><BookOpen size={16} /></div>
                    <h4 className="font-bold text-slate-800 text-sm">Historia del Padecimiento Actual</h4>
                  </div>
                  <button onClick={openScholarSearch} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm">
                    <GraduationCap size={14} /> Evidencia Scholar
                  </button>
                </div>
                <div className="p-8">
                  <p className="text-slate-700 leading-relaxed text-sm font-medium">{patient.illnessHistory}</p>
                </div>
              </div>

              {/* Antecedentes Médicos y Farmacológicos (Fuera de Fisio) */}
              <div className="bg-amber-50/30 rounded-[2.5rem] border border-amber-100 shadow-sm overflow-hidden flex flex-col border-l-8 border-l-amber-500">
                <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-600 text-white rounded-lg"><ClipboardList size={16} /></div>
                    <h4 className="font-bold text-amber-900 text-sm">Antecedentes Médicos y Farmacológicos</h4>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Info size={12} /> Otros Diagnósticos / Comorbilidades</h5>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {patient.medicalHistory || 'No se han registrado comorbilidades relevantes.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-amber-100/50">
                    <div>
                      <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Pill size={12} /> Medicación / Tratamiento Actual</h5>
                      <p className="text-slate-700 text-sm italic">
                        {patient.otherTreatments || 'Sin medicación reportada.'}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-1"><ShieldAlert size={12} /> Interacciones y Riesgos</h5>
                      <p className="text-red-900 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                        {patient.drugInteractions || 'No se han detectado riesgos farmacológicos específicos.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Flags */}
              <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2.5rem] flex items-start gap-4 shadow-sm group">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0"><ShieldAlert size={24} /></div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Alertas de Seguridad</h4>
                  <p className="text-sm font-bold text-red-900 leading-relaxed">{patient.warningSigns || 'Sin señales de alarma específicas.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <VitalCard icon={<Heart className="text-red-500" />} label="FC" value={`${patient.vitalSigns.heartRate} lpm`} />
                <VitalCard icon={<Activity className="text-blue-500" />} label="TA" value={patient.vitalSigns.bloodPressure} />
                <VitalCard icon={<Wind className="text-cyan-500" />} label="SatO2" value={`${patient.vitalSigns.oxygenSaturation}%`} />
                <VitalCard icon={<Thermometer className="text-orange-500" />} label="Temp" value={`${patient.vitalSigns.temperature}ºC`} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6 relative z-10"><Sparkles className="w-6 h-6 text-yellow-300" /><h4 className="font-bold text-lg">Asistente Clínico IA</h4></div>
                <p className="text-blue-50 text-sm italic mb-8 leading-relaxed relative z-10">"Basado en la última evolución, el paciente está listo para aumentar la carga en sentadillas."</p>
                <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Analizar Historial</button>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500" /> Logística</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Última Sesión</span><span className="font-bold text-slate-700">{patient.lastSession}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Derivación</span><span className="font-bold text-slate-700">{patient.referralSource}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Historial de Evolución</h3>
              <button onClick={() => handleAddNoteClick('Evolución')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-100">
                <Plus size={16} /> Nueva Nota
              </button>
            </div>
            
            <div className="space-y-4">
              {patient.notes.filter(n => n.type === 'Evolución').length > 0 ? (
                patient.notes.filter(n => n.type === 'Evolución').map((note) => (
                  <div key={note.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock size={16} /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{note.date}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Por: {note.author}</p>
                        </div>
                      </div>
                      <div className="bg-red-50 px-3 py-1 rounded-full text-[10px] font-black text-red-600 uppercase">Dolor: {note.painLevel}/10</div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{note.content}</p>
                    {note.vitalSigns && (
                      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-50">
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">FC</p><p className="text-xs font-bold text-slate-700">{note.vitalSigns.heartRate}</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">TA</p><p className="text-xs font-bold text-slate-700">{note.vitalSigns.bloodPressure}</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">SatO2</p><p className="text-xs font-bold text-slate-700">{note.vitalSigns.oxygenSaturation}%</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Temp</p><p className="text-xs font-bold text-slate-700">{note.vitalSigns.temperature}º</p></div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-400 italic bg-white rounded-[2rem] border border-slate-100 border-dashed">No hay notas de evolución registradas aún.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Anotaciones del Plan de Trabajo</h3>
              <button onClick={() => handleAddNoteClick('Plan de Trabajo')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-green-100">
                <Plus size={16} /> Nueva Anotación
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ejercicios Asignados</h4>
                {patient.assignedExercises.map(ex => (
                  <div key={ex.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">?</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{ex.title}</p>
                        <p className="text-xs text-slate-400">{ex.reps}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas de Progresión de Plan</h4>
                {patient.notes.filter(n => n.type === 'Plan de Trabajo').length > 0 ? (
                  patient.notes.filter(n => n.type === 'Plan de Trabajo').map(note => (
                    <div key={note.id} className="bg-green-50/50 p-5 rounded-3xl border border-green-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">{note.date}</span>
                        <div className="p-1 bg-white rounded-lg text-green-600 shadow-sm"><ClipboardList size={12} /></div>
                      </div>
                      <p className="text-sm text-green-900 font-medium leading-relaxed italic">"{note.content}"</p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-xs italic border border-dashed border-slate-200 rounded-3xl">No hay anotaciones específicas para el plan.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
             {patient.diagnosticStudies.length > 0 ? (
              patient.diagnosticStudies.map(study => (
                <div key={study.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">{getStudyIcon(study.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1"><h5 className="font-bold text-slate-800">{study.title}</h5><span className="text-[10px] text-slate-400 font-bold">{study.date}</span></div>
                    <p className="text-xs text-slate-500 italic">"{study.resultSummary}"</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center text-slate-400 italic bg-white rounded-[2rem] border border-slate-100 border-dashed">Sin estudios registrados.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const VitalCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
    <div className="flex justify-center mb-1">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value}</p>
  </div>
);

const VitalInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-bold text-slate-700"
    />
  </div>
);

export default ClinicalRecord;
