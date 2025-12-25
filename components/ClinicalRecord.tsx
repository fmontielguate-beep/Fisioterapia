
import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Calendar, Clipboard, Stethoscope, Activity, Sparkles, ChevronRight, TrendingUp,
  FileText, Heart, Wind, Thermometer, AlertTriangle, Beaker, Zap, Layers, Search, Check, Edit2,
  Home, ShieldAlert, Info, Save, BookOpen, ClipboardList, Pill, GraduationCap, X, Clock,
  User, CalendarDays, Dumbbell, StretchHorizontal, Move, Trash2, Brain, Loader2, CalendarPlus,
  Eye, Fingerprint, Compass, FlaskConical, ChevronDown, Scale, Ruler, Zap as BMI
} from 'lucide-react';
import { PatientInfo, DiagnosticType, ClinicalNote, VitalSigns, Exercise, GoniometryRecord, OrthopedicTestResult, ActivityLevel } from '../types';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [clinicalFindings, setClinicalFindings] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteType, setNoteType] = useState<'Evolución' | 'Plan de Trabajo'>('Evolución');
  
  const [editFormData, setEditFormData] = useState<PatientInfo>({ ...patient });

  const tabs = [
    { id: 'summary', label: 'Resumen', icon: Stethoscope },
    { id: 'exam', label: 'Exploración', icon: FlaskConical },
    { id: 'diagnostics', label: 'Pruebas / Tests', icon: FileText },
    { id: 'notes', label: 'Evolución', icon: Clipboard },
    { id: 'exercises', label: 'Plan', icon: Activity },
  ];

  const handleSaveEdit = () => {
    // Recalcular IMC antes de guardar por si acaso
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
      
      {/* Modal de Edición de Datos */}
      {isEditingData && (
        <div className="fixed inset-0 z-[170] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <header className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl"><Edit2 size={24} /></div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Editar Historia Clínica</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Modificando ficha de {patient.name}</p>
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
                <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] border-b pb-2">Constantes Vitales</h4>
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
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Peso (kg)</label>
                    <input type="number" value={editFormData.vitalSigns.weight} onChange={e => setEditFormData({...editFormData, vitalSigns: {...editFormData.vitalSigns, weight: parseFloat(e.target.value)}})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Talla (cm)</label>
                    <input type="number" value={editFormData.vitalSigns.height} onChange={e => setEditFormData({...editFormData, vitalSigns: {...editFormData.vitalSigns, height: parseFloat(e.target.value)}})} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 font-bold" />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] border-b pb-2">Exploración Clínica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inspección Visual</label>
                    <textarea rows={3} value={editFormData.physicalExam.visualInspection} onChange={e => setEditFormData({...editFormData, physicalExam: {...editFormData.physicalExam, visualInspection: e.target.value}})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Palpación</label>
                    <textarea rows={3} value={editFormData.physicalExam.palpation} onChange={e => setEditFormData({...editFormData, physicalExam: {...editFormData.physicalExam, palpation: e.target.value}})} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500" />
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
