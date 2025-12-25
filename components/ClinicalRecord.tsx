
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Calendar, Clipboard, Stethoscope, Activity, Sparkles, ChevronRight, TrendingUp,
  FileText, Heart, Wind, Thermometer, AlertTriangle, Beaker, Zap, Layers, Search, Check, Edit2,
  Home, ShieldAlert, Info, Save, BookOpen, ClipboardList, Pill, GraduationCap, X, Clock,
  User, CalendarDays, Dumbbell, StretchHorizontal, Move, Trash2, Brain, Loader2, CalendarPlus,
  Eye, Fingerprint, Compass, FlaskConical, ChevronDown, Scale, Ruler, Zap as BMI, ClipboardEdit,
  CheckCircle2, PlusCircle
} from 'lucide-react';
import { PatientInfo, ClinicalNote, VitalSigns, Exercise, GoniometryRecord, OrthopedicTestResult, ActivityLevel, PhysicalExamination } from '../types';
import { getClinicalAnalysis } from '../services/geminiService';

interface ClinicalRecordProps {
  patient: PatientInfo;
  onBack: () => void;
  onManagePlan: () => void;
  onUpdatePatient: (patient: PatientInfo) => void;
  onDeletePatient: (id: string) => void;
  onOpenCalendar: () => void;
}

const ClinicalRecord: React.FC<ClinicalRecordProps> = ({ patient, onBack, onManagePlan, onUpdatePatient, onDeletePatient, onOpenCalendar }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'exam' | 'diagnostics' | 'notes' | 'exercises'>('summary');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);
  const [isDeletingPatient, setIsDeletingPatient] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [clinicalFindings, setClinicalFindings] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  
  const [editFormData, setEditFormData] = useState<PatientInfo>({ ...patient });

  // Estado para la nueva nota completa
  const [noteForm, setNoteForm] = useState({
    content: '',
    painLevel: 5,
    type: 'Evolución' as 'Evolución' | 'Plan de Trabajo',
    vitalSigns: { ...patient.vitalSigns },
    physicalExam: { ...patient.physicalExam }
  });

  const tabs = [
    { id: 'summary', label: 'Resumen', icon: Stethoscope },
    { id: 'exam', label: 'Exploración', icon: FlaskConical },
    { id: 'diagnostics', label: 'Pruebas / Tests', icon: FileText },
    { id: 'notes', label: 'Evolución', icon: Clipboard },
    { id: 'exercises', label: 'Plan', icon: Activity },
  ];

  // Cálculo de IMC automático en el modal de nota
  useEffect(() => {
    const w = noteForm.vitalSigns.weight;
    const h = noteForm.vitalSigns.height / 100;
    if (w > 0 && h > 0) {
      const calculatedBmi = parseFloat((w / (h * h)).toFixed(2));
      if (calculatedBmi !== noteForm.vitalSigns.bmi) {
        setNoteForm(prev => ({
          ...prev,
          vitalSigns: { ...prev.vitalSigns, bmi: calculatedBmi }
        }));
      }
    }
  }, [noteForm.vitalSigns.weight, noteForm.vitalSigns.height]);

  const handleSaveEdit = () => {
    const weight = editFormData.vitalSigns.weight;
    const heightM = editFormData.vitalSigns.height / 100;
    const bmi = weight / (heightM * heightM);
    
    const finalData = {
      ...editFormData,
      vitalSigns: {
        ...editFormData.vitalSigns,
        bmi: parseFloat(bmi.toFixed(2))
      }
    };

    onUpdatePatient(finalData);
    setIsEditingData(false);
  };

  const handleSaveEvolution = () => {
    if (!noteForm.content.trim()) return;

    const newNote: ClinicalNote = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: noteForm.content,
      painLevel: noteForm.painLevel,
      author: 'Fisioterapeuta Colegiado',
      type: noteForm.type,
      vitalSigns: { ...noteForm.vitalSigns },
      physicalExam: { ...noteForm.physicalExam }
    };

    // Actualizamos el paciente con los nuevos datos de la evolución y añadimos la nota
    const updatedPatient: PatientInfo = {
      ...patient,
      vitalSigns: { ...noteForm.vitalSigns },
      physicalExam: { ...noteForm.physicalExam },
      notes: [newNote, ...patient.notes],
      lastSession: 'Hoy'
    };

    onUpdatePatient(updatedPatient);
    setIsAddingNote(false);
    setNoteForm({
      content: '',
      painLevel: 5,
      type: 'Evolución',
      vitalSigns: { ...updatedPatient.vitalSigns },
      physicalExam: { ...updatedPatient.physicalExam }
    });
  };

  const handleAiAnalysis = async () => {
    if (!clinicalFindings.trim()) return;
    setIsAnalysisLoading(true);
    const result = await getClinicalAnalysis(clinicalFindings, patient);
    setAiAnalysisResult(result);
    setIsAnalysisLoading(false);
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-emerald-500';
    if (bmi < 30) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20 relative">
      
      {/* Modal de Nueva Evolución / Nota Completa */}
      {isAddingNote && (
        <div className="fixed inset-0 z-[180] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
            <header className="p-8 bg-emerald-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl"><ClipboardEdit size={24} /></div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Nueva Nota de Evolución Clínica</h3>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Registrando sesión completa para {patient.name}</p>
                </div>
              </div>
              <button onClick={() => setIsAddingNote(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><X size={28} /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
              {/* Tipo y Contenido Principal */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Notas de la Sesión</h4>
                  <textarea 
                    value={noteForm.content} 
                    onChange={e => setNoteForm({...noteForm, content: e.target.value})}
                    placeholder="Escribe el desarrollo de la sesión, respuesta al tratamiento, cambios en síntomas..."
                    rows={6}
                    className="w-full p-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-sm leading-relaxed"
                  />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Nota</label>
                    <div className="flex gap-2">
                      {['Evolución', 'Plan de Trabajo'].map((t: any) => (
                        <button 
                          key={t} onClick={() => setNoteForm({...noteForm, type: t})}
                          className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${noteForm.type === t ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white text-slate-400 border-slate-100'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nivel de Dolor (EVA)</label>
                      <span className="text-xl font-black text-emerald-600">{noteForm.painLevel}/10</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" 
                      value={noteForm.painLevel} 
                      onChange={e => setNoteForm({...noteForm, painLevel: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              </section>

              {/* Signos Vitales y Biometría */}
              <section className="space-y-6">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2 flex items-center gap-2"><Heart size={14}/> Signos Vitales y Biometría Hoy</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">FC (lpm)</label>
                    <input type="number" value={noteForm.vitalSigns.heartRate} onChange={e => setNoteForm({...noteForm, vitalSigns: {...noteForm.vitalSigns, heartRate: parseInt(e.target.value)}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">FR (rpm)</label>
                    <input type="number" value={noteForm.vitalSigns.respiratoryRate} onChange={e => setNoteForm({...noteForm, vitalSigns: {...noteForm.vitalSigns, respiratoryRate: parseInt(e.target.value)}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Tensión (TA)</label>
                    <input type="text" value={noteForm.vitalSigns.bloodPressure} onChange={e => setNoteForm({...noteForm, vitalSigns: {...noteForm.vitalSigns, bloodPressure: e.target.value}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">SatO2 (%)</label>
                    <input type="number" value={noteForm.vitalSigns.oxygenSaturation} onChange={e => setNoteForm({...noteForm, vitalSigns: {...noteForm.vitalSigns, oxygenSaturation: parseInt(e.target.value)}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Peso (kg)</label>
                    <input type="number" step="0.1" value={noteForm.vitalSigns.weight} onChange={e => setNoteForm({...noteForm, vitalSigns: {...noteForm.vitalSigns, weight: parseFloat(e.target.value)}})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">IMC (Auto)</label>
                    <div className="w-full px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 font-black text-emerald-700 text-center">{noteForm.vitalSigns.bmi}</div>
                  </div>
                </div>
              </section>

              {/* Exploración Física */}
              <section className="space-y-6">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2 flex items-center gap-2"><Eye size={14}/> Exploración Física Hoy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspección Visual Actualizada</label>
                    <textarea 
                      rows={3} value={noteForm.physicalExam.visualInspection} 
                      onChange={e => setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, visualInspection: e.target.value}})} 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Palpación Actualizada</label>
                    <textarea 
                      rows={3} value={noteForm.physicalExam.palpation} 
                      onChange={e => setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, palpation: e.target.value}})} 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-medium text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </section>

              {/* Goniometría */}
              <section className="space-y-6">
                <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Compass size={14}/> Goniometría Actualizada</h4>
                  <button 
                    onClick={() => {
                      const newGonio: GoniometryRecord = { joint: 'Nueva Artic.', movement: 'Flexión', activeRange: '0', passiveRange: '0' };
                      setNoteForm({
                        ...noteForm,
                        physicalExam: { ...noteForm.physicalExam, goniometry: [...noteForm.physicalExam.goniometry, newGonio] }
                      });
                    }}
                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {noteForm.physicalExam.goniometry.map((g, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-2 gap-4 relative">
                       <button 
                        onClick={() => {
                          const updatedGonio = noteForm.physicalExam.goniometry.filter((_, idx) => idx !== i);
                          setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, goniometry: updatedGonio}});
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-slate-100 text-red-400 rounded-full flex items-center justify-center hover:bg-red-50"
                       >
                         <Trash2 size={12} />
                       </button>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase">Articulación</label>
                          <input 
                            type="text" value={g.joint} 
                            onChange={e => {
                              const newList = [...noteForm.physicalExam.goniometry];
                              newList[i].joint = e.target.value;
                              setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, goniometry: newList}});
                            }}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs font-bold outline-none"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase">Movimiento</label>
                          <input 
                            type="text" value={g.movement} 
                            onChange={e => {
                              const newList = [...noteForm.physicalExam.goniometry];
                              newList[i].movement = e.target.value;
                              setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, goniometry: newList}});
                            }}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs font-bold outline-none"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase">Activo (º)</label>
                          <input 
                            type="text" value={g.activeRange} 
                            onChange={e => {
                              const newList = [...noteForm.physicalExam.goniometry];
                              newList[i].activeRange = e.target.value;
                              setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, goniometry: newList}});
                            }}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs font-bold outline-none"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase">Pasivo (º)</label>
                          <input 
                            type="text" value={g.passiveRange} 
                            onChange={e => {
                              const newList = [...noteForm.physicalExam.goniometry];
                              newList[i].passiveRange = e.target.value;
                              setNoteForm({...noteForm, physicalExam: {...noteForm.physicalExam, goniometry: newList}});
                            }}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs font-bold outline-none"
                          />
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
              <button onClick={() => setIsAddingNote(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Descartar</button>
              <button onClick={handleSaveEvolution} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Guardar Evolución Completa
              </button>
            </footer>
          </div>
        </div>
      )}
      
      {/* Modal de Edición de Datos Básicos */}
      {isEditingData && (
        <div className="fixed inset-0 z-[170] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <header className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl"><Edit2 size={24} /></div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Editar Ficha Base</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Modificando perfil de {patient.name}</p>
                </div>
              </div>
              <button onClick={() => setIsEditingData(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><X size={28} /></button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <section className="space-y-6">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] border-b pb-2">Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Condición Principal</label>
                    <input type="text" value={editFormData.condition} onChange={e => setEditFormData({...editFormData, condition: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel de Actividad</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['Sedentario', 'Leve', 'Moderado', 'Activo', 'Muy Activo'] as ActivityLevel[]).map(level => (
                      <button 
                        key={level} type="button" 
                        onClick={() => setEditFormData({...editFormData, physicalActivityLevel: level})}
                        className={`py-3 rounded-xl border text-[9px] font-black uppercase transition-all ${editFormData.physicalActivityLevel === level ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] border-b pb-2">Constantes de Referencia</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">FC (lpm)</label>
                    <input type="number" value={editFormData.vitalSigns.heartRate} onChange={e => setEditFormData({...editFormData, vitalSigns: {...editFormData.vitalSigns, heartRate: parseInt(e.target.value)}})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">FR (rpm)</label>
                    <input type="number" value={editFormData.vitalSigns.respiratoryRate} onChange={e => setEditFormData({...editFormData, vitalSigns: {...editFormData.vitalSigns, respiratoryRate: parseInt(e.target.value)}})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">SatO2 (%)</label>
                    <input type="number" value={editFormData.vitalSigns.oxygenSaturation} onChange={e => setEditFormData({...editFormData, vitalSigns: {...editFormData.vitalSigns, oxygenSaturation: parseInt(e.target.value)}})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Tensión</label>
                    <input type="text" value={editFormData.vitalSigns.bloodPressure} onChange={e => setEditFormData({...editFormData, vitalSigns: {...editFormData.vitalSigns, bloodPressure: e.target.value}})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 font-bold" />
                  </div>
                </div>
              </section>
            </div>

            <footer className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
              <button onClick={() => setIsEditingData(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
              <button onClick={handleSaveEdit} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Save size={18} /> Guardar Cambios
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminación Paciente */}
      {isDeletingPatient && (
        <div className="fixed inset-0 z-[190] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 p-10 text-center">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><AlertTriangle size={40} /></div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">¿Eliminar Paciente?</h3>
             <p className="text-slate-500 mt-3 mb-10 text-sm leading-relaxed">Se borrará toda la historia clínica de <span className="font-bold text-slate-800">{patient.name}</span>. Esta acción es definitiva.</p>
             <div className="flex flex-col gap-4">
               <button onClick={() => onDeletePatient(patient.id)} className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:bg-red-700 transition-all">Eliminar Permanente</button>
               <button onClick={() => setIsDeletingPatient(false)} className="w-full bg-slate-50 text-slate-600 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest">Cancelar</button>
             </div>
          </div>
        </div>
      )}

      {/* Modal Análisis IA */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[160] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
             <header className="p-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><Brain size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Análisis Clínico Avanzado</h3>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Soporte a la Decisión Clínica EBP</p>
                  </div>
                </div>
                <button onClick={() => setIsAnalyzing(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><X size={28} /></button>
             </header>
             <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <section className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Hallazgos Actuales</h4>
                  <textarea 
                    value={clinicalFindings} onChange={(e) => setClinicalFindings(e.target.value)}
                    placeholder="Describe los nuevos hallazgos, EVA, respuesta a la carga..."
                    rows={4} className="w-full p-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                  <button onClick={handleAiAnalysis} disabled={isAnalysisLoading || !clinicalFindings.trim()} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl flex items-center justify-center gap-3">
                    {isAnalysisLoading ? <><Loader2 className="animate-spin" /> Procesando Motor Clínico...</> : <><Sparkles size={18} /> Generar Análisis IA</>}
                  </button>
                </section>
                {aiAnalysisResult && (
                  <div className="bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 p-8 animate-in fade-in">
                    <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><Check className="text-emerald-500" /> Diagnóstico y Planificación Sugerida</h4>
                    <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{aiAnalysisResult}</div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Cabecera Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-lg p-4 rounded-3xl border border-white/40 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><ArrowLeft className="w-4 h-4" /></div>
            <span>Volver</span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <button onClick={onOpenCalendar} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
             <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 border border-slate-100"><CalendarPlus className="w-4 h-4" /></div>
            <span>Agendar</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAnalyzing(true)} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl">
            <Brain size={14} /> Análisis IA
          </button>
          <button onClick={() => setIsEditingData(true)} className="bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Edit2 size={14} /> Editar
          </button>
          <button onClick={() => setIsDeletingPatient(true)} className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 shadow-sm">
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>

      {/* Info Paciente y Actividad */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col lg:flex-row justify-between items-stretch gap-8 overflow-hidden">
        <div className="flex items-center gap-6 flex-1">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black shadow-lg">{patient.name.charAt(0)}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold text-slate-800 truncate">{patient.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${patient.patientType === 'Intrahospitalario' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{patient.patientType}</span>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100"><Activity size={12} /> {patient.condition}</div>
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-indigo-100"><TrendingUp size={12} /> Nivel: {patient.physicalActivityLevel}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex items-center gap-8 min-w-[380px] shadow-inner">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
             <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="-10 -10 140 140">
               <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
               <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={314.159} strokeDashoffset={314.159 * (1 - patient.progress / 100)} strokeLinecap="round" className="text-blue-600 transition-all duration-1000 ease-out" />
             </svg>
             <span className="absolute text-2xl font-black text-slate-800 tracking-tighter">{patient.progress}%</span>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Recuperación</p>
            <p className="text-lg font-black text-slate-700 leading-tight">Fase: {patient.progress > 70 ? 'Readaptación' : 'Consolidación'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30 rounded-t-xl' : 'text-slate-400 hover:text-slate-600'}`}><Icon className="w-4 h-4" /> {tab.label}</button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="min-h-[500px]">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Nueva Cuadrícula de Signos Vitales Ampliada */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <VitalDisplayCard icon={<Heart className="text-red-500" />} label="Frec. Cardíaca" value={patient.vitalSigns.heartRate} unit="lpm" />
                <VitalDisplayCard icon={<TrendingUp className="text-blue-500" />} label="Frec. Resp" value={patient.vitalSigns.respiratoryRate} unit="rpm" />
                <VitalDisplayCard icon={<Activity className="text-emerald-500" />} label="Tensión Art." value={patient.vitalSigns.bloodPressure} unit="" />
                <VitalDisplayCard icon={<Wind className="text-cyan-500" />} label="SatO2" value={patient.vitalSigns.oxygenSaturation} unit="%" />
                <VitalDisplayCard icon={<Thermometer className="text-orange-500" />} label="Temperatura" value={patient.vitalSigns.temperature} unit="ºC" />
                <VitalDisplayCard icon={<Scale className="text-slate-500" />} label="Peso" value={patient.vitalSigns.weight} unit="kg" />
                <VitalDisplayCard icon={<Ruler className="text-slate-500" />} label="Talla" value={patient.vitalSigns.height} unit="cm" />
                <VitalDisplayCard icon={<BMI className={getBMIColor(patient.vitalSigns.bmi)} />} label="IMC (BMI)" value={patient.vitalSigns.bmi.toFixed(1)} unit="" />
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden border-l-8 border-l-blue-600 p-8 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-lg"><BookOpen size={16} /></div>
                    <h4 className="font-bold text-slate-800 text-sm">Historia y Diagnóstico</h4>
                 </div>
                 <p className="text-slate-700 leading-relaxed text-sm font-medium">{patient.illnessHistory}</p>
                 <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad Usual:</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-600">{patient.physicalActivityLevel}</span>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6 relative z-10"><Sparkles className="w-6 h-6 text-yellow-300" /><h4 className="font-bold text-lg">Asistente IA</h4></div>
                <p className="text-blue-50 text-sm italic mb-8 leading-relaxed relative z-10">"Sugerencia: Dado el IMC de {patient.vitalSigns.bmi.toFixed(1)}, considere ejercicios de bajo impacto para proteger las articulaciones de carga."</p>
                <button onClick={() => setIsAnalyzing(true)} className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Abrir Razonamiento Clínico</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <Eye className="w-6 h-6" />
                  <h4 className="font-black text-lg text-slate-800">Inspección Visual</h4>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {patient.physicalExam?.visualInspection || "No se han registrado datos."}
                </p>
                <div className="flex items-center gap-3 text-emerald-600 pt-4">
                  <Fingerprint className="w-6 h-6" />
                  <h4 className="font-black text-lg text-slate-800">Palpación Clínica</h4>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {patient.physicalExam?.palpation || "No se han registrado datos."}
                </p>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                  <Compass className="w-6 h-6" />
                  <h4 className="font-black text-lg text-slate-800">Goniometría</h4>
                </div>
                <div className="space-y-3 overflow-hidden rounded-3xl border border-slate-100">
                   <div className="bg-slate-50 px-5 py-3 grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                      <span>Artic.</span><span>Mov.</span><span className="text-center">Activo</span><span className="text-center">Pasivo</span>
                   </div>
                   {patient.physicalExam?.goniometry.map((g, i) => (
                     <div key={i} className="px-5 py-4 grid grid-cols-4 text-xs font-bold text-slate-700 border-b last:border-0 hover:bg-slate-50/50">
                        <span>{g.joint}</span><span className="text-slate-500">{g.movement}</span><span className="text-center text-blue-600">{g.activeRange}º</span><span className="text-center text-emerald-600">{g.passiveRange}º</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-8 animate-in fade-in">
             <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FlaskConical className="text-blue-500 w-5 h-5" /> Test Ortopédicos Realizados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {patient.physicalExam?.orthopedicTests.map((test) => (
                     <div key={test.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                        <div className="flex justify-between items-start">
                           <span className="px-3 py-1 bg-white text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{test.category}</span>
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${test.result === 'Positivo' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>{test.result}</span>
                        </div>
                        <h5 className="font-bold text-slate-800">{test.testName}</h5>
                        <p className="text-xs text-slate-500 italic">"{test.observations || 'Sin observaciones.'}"</p>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Histórico de Evolución</h3>
                <button 
                  onClick={() => setIsAddingNote(true)} 
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700"
                >
                  <Plus size={16} /> Nueva Evolución / Plan
                </button>
             </div>

             <div className="space-y-4">
                {patient.notes.length > 0 ? (
                  patient.notes.map((note) => (
                    <div key={note.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden border-l-4 border-l-emerald-500">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Clipboard size={16}/></div>
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm">{note.type}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{note.date}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase">Dolor:</span>
                             <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black">{note.painLevel}/10</span>
                          </div>
                       </div>
                       <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                       
                       {/* Mini resumen de vitales en la nota */}
                       {note.vitalSigns && (
                         <div className="pt-4 mt-4 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-slate-400 font-bold">
                            <span className="flex items-center gap-1"><Heart size={10} className="text-red-400"/> {note.vitalSigns.heartRate} lpm</span>
                            <span className="flex items-center gap-1"><Activity size={10} className="text-blue-400"/> {note.vitalSigns.bloodPressure}</span>
                            <span className="flex items-center gap-1"><Wind size={10} className="text-cyan-400"/> {note.vitalSigns.oxygenSaturation}%</span>
                            <span className="flex items-center gap-1"><BMI size={10} className="text-emerald-400"/> IMC: {note.vitalSigns.bmi}</span>
                         </div>
                       )}
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center space-y-4">
                    <Clipboard className="mx-auto text-slate-300 w-12 h-12" />
                    <p className="text-slate-400 font-bold text-sm">No hay registros de evolución aún.</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Plan de Trabajo Actual</h3>
                <button 
                  onClick={onManagePlan} 
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2 hover:bg-blue-700"
                >
                  <PlusCircle size={16} /> Modificar Plan
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.assignedExercises.map((ex) => (
                  <div key={ex.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Dumbbell size={24}/></div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{ex.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{ex.category} • {ex.reps}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {patient.assignedExercises.length === 0 && (
                   <div className="col-span-full py-12 text-center text-slate-400 font-medium bg-slate-50 rounded-[2.5rem]">
                      No hay ejercicios asignados.
                   </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VitalDisplayCard = ({ icon, label, value, unit }: any) => (
  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-1">
    <div className="flex justify-center mb-1">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
    <p className="text-lg font-black text-slate-800">{value} <span className="text-[10px] text-slate-400 opacity-60">{unit}</span></p>
  </div>
);

export default ClinicalRecord;
