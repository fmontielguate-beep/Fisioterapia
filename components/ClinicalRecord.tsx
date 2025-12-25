
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Stethoscope, Sparkles, 
  FileText, X, Eye, FlaskConical, CheckCircle2, Move,
  Edit3, BookOpen, Youtube, ShieldCheck, Pill, AlertCircle, 
  Search, BrainCircuit, LibraryBig, Loader2, Save, Calculator,
  CalendarDays, Heart, Activity, Ruler, Trash2, ClipboardCheck
} from 'lucide-react';
import { PatientInfo, ClinicalNote, VitalSigns, GoniometryRecord } from '../types';
import { getClinicalAnalysis } from '../services/geminiService';
import DosageCalculator from './DosageCalculator';

interface ClinicalRecordProps {
  patient: PatientInfo;
  onBack: () => void;
  onManagePlan: () => void;
  onUpdatePatient: (patient: PatientInfo) => void;
  onEditProfile: () => void;
  onDeletePatient: (id: string) => void;
  onOpenCalendar: () => void;
}

const ClinicalRecord: React.FC<ClinicalRecordProps> = ({ patient, onBack, onManagePlan, onUpdatePatient, onEditProfile, onDeletePatient, onOpenCalendar }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'exam' | 'diagnostics' | 'notes' | 'exercises'>('summary');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [clinicalFindingsInput, setClinicalFindingsInput] = useState('');
  const [showLocalCalc, setShowLocalCalc] = useState(false);
  
  // Form de Evolución - Inicializado con datos actuales
  const [evoData, setEvoData] = useState({
    hr: patient.vitalSigns.heartRate.toString(),
    ta: patient.vitalSigns.bloodPressure,
    sat: patient.vitalSigns.oxygenSaturation.toString(),
    fr: patient.vitalSigns.respiratoryRate.toString(),
    temp: patient.vitalSigns.temperature.toString(),
    weight: patient.vitalSigns.weight.toString(),
    height: patient.vitalSigns.height.toString(),
    bmi: patient.vitalSigns.bmi.toString(),
    visual: '',
    palpation: '',
    impression: '',
    pain: 0,
    goniometry: [] as GoniometryRecord[]
  });

  const [isEditingExam, setIsEditingExam] = useState(false);
  const [tempExam, setTempExam] = useState({
    visual: patient.physicalExam.visualInspection,
    palpation: patient.physicalExam.palpation
  });

  useEffect(() => {
    const w = parseFloat(evoData.weight);
    const h = parseFloat(evoData.height) / 100;
    if (w > 0 && h > 0) {
      const calculated = (w / (h * h)).toFixed(2);
      setEvoData(prev => ({ ...prev, bmi: calculated }));
    }
  }, [evoData.weight, evoData.height]);

  const tabs = [
    { id: 'summary', label: 'Resumen e IA', icon: ShieldCheck },
    { id: 'exam', label: 'Exploración', icon: Stethoscope },
    { id: 'diagnostics', label: 'Estudios', icon: FlaskConical },
    { id: 'notes', label: 'Historial', icon: FileText },
    { id: 'exercises', label: 'Plan EBP', icon: BookOpen },
  ];

  const handleSaveExam = () => {
    onUpdatePatient({
      ...patient,
      physicalExam: {
        ...patient.physicalExam,
        visualInspection: tempExam.visual,
        palpation: tempExam.palpation
      }
    });
    setIsEditingExam(false);
  };

  const addGonioRow = () => {
    setEvoData(prev => ({
      ...prev,
      goniometry: [...prev.goniometry, { joint: '', movement: '', activeRange: '', passiveRange: '' }]
    }));
  };

  const removeGonioRow = (index: number) => {
    setEvoData(prev => ({
      ...prev,
      goniometry: prev.goniometry.filter((_, i) => i !== index)
    }));
  };

  const handleSaveEvolution = () => {
    if (!evoData.impression.trim()) {
      alert("La Impresión Clínica Final es obligatoria.");
      return;
    }

    const newVitals: VitalSigns = {
      heartRate: parseInt(evoData.hr) || 0,
      bloodPressure: evoData.ta,
      oxygenSaturation: parseInt(evoData.sat) || 0,
      respiratoryRate: parseInt(evoData.fr) || 0,
      temperature: parseFloat(evoData.temp) || 0,
      weight: parseFloat(evoData.weight) || 0,
      height: parseFloat(evoData.height) || 0,
      bmi: parseFloat(evoData.bmi) || 0
    };

    const newNote: ClinicalNote = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES'),
      content: evoData.impression,
      painLevel: evoData.pain,
      author: 'Fisio Principal',
      type: 'Evolución',
      vitalSigns: newVitals,
      physicalExam: {
        visualInspection: evoData.visual,
        palpation: evoData.palpation,
        goniometry: evoData.goniometry,
        orthopedicTests: [] 
      }
    };

    const updatedPatient: PatientInfo = {
      ...patient,
      vitalSigns: newVitals,
      physicalExam: {
        ...patient.physicalExam,
        visualInspection: evoData.visual || patient.physicalExam.visualInspection,
        palpation: evoData.palpation || patient.physicalExam.palpation,
        goniometry: evoData.goniometry.length > 0 ? evoData.goniometry : patient.physicalExam.goniometry
      },
      notes: [newNote, ...patient.notes],
      lastSession: new Date().toLocaleDateString('es-ES')
    };

    onUpdatePatient(updatedPatient);
    setIsAddingNote(false);
    // Limpieza
    setEvoData(prev => ({ ...prev, visual: '', palpation: '', impression: '', goniometry: [] }));
  };

  const handleClinicalReasoning = async (text: string) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    const result = await getClinicalAnalysis(text, patient);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative pb-10">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sticky top-0 z-40 gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest group px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Listado
        </button>
        <div className="flex flex-wrap gap-2">
           <button onClick={onOpenCalendar} className="bg-white text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <CalendarDays size={14} className="text-emerald-500" /> Agenda
           </button>
           <button onClick={() => setShowLocalCalc(true)} className="bg-white text-blue-600 border border-blue-100 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2">
              <Calculator size={14} /> Calculadora
           </button>
           <button onClick={onEditProfile} className="bg-white text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <Edit3 size={14} /> Editar Perfil
           </button>
           <button onClick={onManagePlan} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-400" /> Plan de Trabajo
           </button>
           <button onClick={() => setIsAddingNote(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-50 transition-all flex items-center gap-2">
              <Plus size={14} /> Nueva Evolución
           </button>
        </div>
      </header>

      {/* Perfil Mini */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white text-4xl font-black shadow-xl shrink-0">{patient.name.charAt(0)}</div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{patient.name}</h2>
            <button onClick={onEditProfile} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><Edit3 size={18}/></button>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">{patient.condition}</span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">{patient.physicalActivityLevel}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)} 
            className={`px-8 py-5 font-black text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === t.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className="flex items-center gap-2"><t.icon size={14} /> {t.label}</div>
            {activeTab === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      <main className="min-h-[500px] py-6">
        {activeTab === 'summary' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryBox icon={AlertCircle} label="Signos Alarma" value={patient.warningSigns} color="red" />
                <SummaryBox icon={ShieldCheck} label="Alergias" value={patient.allergies} color="amber" />
                <SummaryBox icon={Pill} label="Medicación" value={patient.otherTreatments} color="blue" subValue={patient.drugInteractions} />
             </div>

             <div className="bg-indigo-50 p-10 rounded-[3.5rem] border border-indigo-100 shadow-sm relative overflow-hidden group">
                <BrainCircuit className="absolute -right-10 -bottom-10 opacity-5 text-indigo-900" size={240} />
                <div className="relative z-10 space-y-6">
                   <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-3"><Sparkles className="text-indigo-600" /> Razonamiento EBP</h3>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <textarea 
                            rows={5} 
                            value={clinicalFindingsInput}
                            onChange={(e) => setClinicalFindingsInput(e.target.value)}
                            className="w-full p-6 rounded-[2rem] bg-white border border-indigo-100 outline-none font-bold text-slate-700 shadow-inner"
                            placeholder="Ingrese hallazgos clínicos atípicos para análisis diferencial..."
                         />
                         <button onClick={() => handleClinicalReasoning(clinicalFindingsInput)} disabled={isAnalyzing || !clinicalFindingsInput.trim()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 shadow-xl">
                            {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <BrainCircuit size={16}/>} Analizar con IA
                         </button>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-[2.5rem] p-8 max-h-[300px] overflow-y-auto">
                        <p className="text-[11px] text-slate-800 leading-relaxed italic">{analysisResult || "Esperando hallazgos para procesar..."}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <VitalBox label="FC" value={patient.vitalSigns.heartRate} unit="lpm" color="red" />
                <VitalBox label="TA" value={patient.vitalSigns.bloodPressure} unit="" color="emerald" />
                <VitalBox label="SatO2" value={patient.vitalSigns.oxygenSaturation} unit="%" color="blue" />
                <VitalBox label="Temp" value={patient.vitalSigns.temperature} unit="ºC" color="orange" />
                <VitalBox label="Peso" value={patient.vitalSigns.weight} unit="kg" color="slate" />
                <VitalBox label="IMC" value={patient.vitalSigns.bmi.toFixed(1)} unit="" color="indigo" highlight />
             </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
             <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
                   <div className="flex justify-between items-center mb-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Eye size={14}/> Inspección y Palpación</h4>
                     {!isEditingExam ? (
                       <button onClick={() => setIsEditingExam(true)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-xl transition-all"><Edit3 size={16}/></button>
                     ) : (
                       <button onClick={handleSaveExam} className="text-white bg-emerald-600 p-2 rounded-xl shadow-lg animate-pulse"><Save size={16}/></button>
                     )}
                   </div>
                   <div className="space-y-6">
                      {isEditingExam ? (
                        <>
                          <textarea className="w-full p-4 bg-slate-50 rounded-2xl border border-emerald-100 text-xs font-bold focus:bg-white outline-none" value={tempExam.visual} onChange={e => setTempExam({...tempExam, visual: e.target.value})} placeholder="Inspección Visual..."/>
                          <textarea className="w-full p-4 bg-slate-50 rounded-2xl border border-emerald-100 text-xs font-bold focus:bg-white outline-none" value={tempExam.palpation} onChange={e => setTempExam({...tempExam, palpation: e.target.value})} placeholder="Palpación..."/>
                        </>
                      ) : (
                        <>
                          <div><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Visual</p><p className="text-sm text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl italic">"{patient.physicalExam.visualInspection || 'Normal.'}"</p></div>
                          <div><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Palpación</p><p className="text-sm text-slate-700 font-bold bg-slate-50 p-4 rounded-2xl italic">"{patient.physicalExam.palpation || 'Sin hallazgos.'}"</p></div>
                        </>
                      )}
                   </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Move size={14}/> Goniometría</h4>
                   <div className="space-y-3">
                      {patient.physicalExam.goniometry.map((g, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <div><p className="text-[8px] font-black text-slate-400 uppercase">{g.joint}</p><p className="text-xs font-black text-slate-800">{g.movement}</p></div>
                           <div className="flex gap-4 font-black text-[10px]"><span className="text-emerald-600">A: {g.activeRange}º</span><span className="text-blue-600">P: {g.passiveRange}º</span></div>
                        </div>
                      ))}
                      {patient.physicalExam.goniometry.length === 0 && (
                        <div className="text-center py-6 text-slate-300 border-2 border-dashed border-slate-50 rounded-2xl">
                          <p className="text-[9px] font-black uppercase tracking-widest">NINGUNO</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><FlaskConical size={14}/> Tests Ortopédicos</h4>
                <div className="space-y-4">
                   {patient.physicalExam.orthopedicTests.map((t) => (
                     <div key={t.id} className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex justify-between items-center">
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">{t.category}</p><h5 className="text-xs font-black text-slate-800">{t.testName}</h5></div>
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${t.result === 'Positivo' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>{t.result}</span>
                     </div>
                   ))}
                   {patient.physicalExam.orthopedicTests.length === 0 && (
                     <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">NINGUNO: Sin tests</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
             {(patient.diagnosticStudies || []).length > 0 ? (patient.diagnosticStudies || []).map(study => (
               <div key={study.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-6">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><FlaskConical size={24} /></div>
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-0.5 rounded-lg">{study.type}</span>
                    <h4 className="text-lg font-black text-slate-800 mt-2">{study.title}</h4>
                    <p className="text-xs text-slate-600 font-bold italic mt-2">"{study.resultSummary}"</p>
                  </div>
               </div>
             )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">NINGUNO: Sin estudios registrados</p>
                </div>
             )}
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            {patient.assignedExercises.length > 0 ? patient.assignedExercises.map(ex => (
                <div key={ex.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col group hover:border-emerald-200 transition-all">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit mb-4">{ex.category}</span>
                  <h4 className="text-xl font-black text-slate-800 mb-2">{ex.title}</h4>
                  <p className="text-xs text-slate-500 mb-8 italic flex-1 leading-relaxed">"{ex.description}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ex.reps}</span>
                     <a href={ex.videoUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md">
                       <Youtube size={14} /> Video
                     </a>
                  </div>
                </div>
            )) : (
              <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">NINGUNO: Plan de trabajo vacío</p>
                <button onClick={onManagePlan} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg mt-4 flex items-center gap-2 mx-auto">
                  <BookOpen size={14}/> Nuevo Plan Ahora
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
           <div className="space-y-6 animate-in fade-in">
              {patient.notes.length > 0 ? patient.notes.map(note => (
                <div key={note.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm border-l-[12px] border-l-emerald-600 group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                         <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{note.type}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{note.date}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2 rounded-2xl border border-red-100">
                         <span className="text-xl font-black">{note.painLevel}/10</span>
                      </div>
                   </div>
                   <p className="text-slate-700 text-sm italic bg-slate-50 p-6 rounded-[2rem] leading-relaxed">"{note.content}"</p>
                </div>
              )) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                   <p className="text-slate-400 font-black text-xs uppercase tracking-widest">NINGUNO: Sin historial de evoluciones</p>
                </div>
              )}
           </div>
        )}
      </main>

      {/* MODAL EVOLUCIÓN COMPLETA (FINAL) */}
      {isAddingNote && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl animate-in zoom-in duration-300 my-8 border border-slate-100">
             <header className="p-10 bg-emerald-600 text-white flex justify-between items-center rounded-t-[3.5rem] sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md"><Activity size={28}/></div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest">Nueva Evolución Clínica</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Evaluación Integral v2.8</p>
                  </div>
                </div>
                <button onClick={() => setIsAddingNote(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full"><X size={32}/></button>
             </header>

             <div className="p-10 sm:p-14 space-y-14 h-full">
                {/* 1. CONSTANTES Y BIOMETRÍA */}
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Heart size={20} className="text-red-500 animate-pulse"/>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Signos Vitales y Biometría</h4>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
                      <EvoInput label="FC (lpm)" value={evoData.hr} onChange={v => setEvoData({...evoData, hr: v})} type="number" color="red" />
                      <EvoInput label="TA (mmHg)" value={evoData.ta} onChange={v => setEvoData({...evoData, ta: v})} color="emerald" />
                      <EvoInput label="SatO2 (%)" value={evoData.sat} onChange={v => setEvoData({...evoData, sat: v})} type="number" color="blue" />
                      <EvoInput label="FR (rpm)" value={evoData.fr} onChange={v => setEvoData({...evoData, fr: v})} type="number" color="slate" />
                      <EvoInput label="Temp (ºC)" value={evoData.temp} onChange={v => setEvoData({...evoData, temp: v})} type="number" color="orange" />
                      <EvoInput label="Peso (kg)" value={evoData.weight} onChange={v => setEvoData({...evoData, weight: v})} type="number" color="indigo" />
                      <EvoInput label="Talla (cm)" value={evoData.height} onChange={v => setEvoData({...evoData, height: v})} type="number" color="slate" />
                   </div>
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between text-white shadow-2xl shadow-indigo-100/20 max-w-md mx-auto border border-white/10">
                        <div className="flex items-center gap-3">
                           <Ruler className="text-indigo-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">IMC Actualizado</span>
                        </div>
                        <span className="text-5xl font-black text-emerald-400">{evoData.bmi}</span>
                   </div>
                </section>

                {/* 2. EXPLORACIÓN FÍSICA EN SESIÓN */}
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Stethoscope size={20} className="text-emerald-500"/>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Exploración Clínica</h4>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Eye size={12}/> Inspección Visual</label>
                        <textarea rows={4} value={evoData.visual} onChange={e => setEvoData({...evoData, visual: e.target.value})} className="w-full p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 outline-none font-bold text-slate-700 text-xs shadow-inner" placeholder="Piel, cicatrices, edemas, patrones de movimiento..."/>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Move size={12}/> Palpación</label>
                        <textarea rows={4} value={evoData.palpation} onChange={e => setEvoData({...evoData, palpation: e.target.value})} className="w-full p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 outline-none font-bold text-slate-700 text-xs shadow-inner" placeholder="Temperatura local, puntos gatillo, tono, crepitaciones..."/>
                      </div>
                   </div>

                   {/* Goniometría Dinámica */}
                   <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Move size={14}/> Registro Goniométrico</h5>
                        <button onClick={addGonioRow} className="text-[9px] font-black text-emerald-600 uppercase bg-white px-5 py-2 rounded-2xl border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-all">+ Nueva Medición</button>
                      </div>
                      <div className="space-y-4">
                         {evoData.goniometry.map((g, i) => (
                           <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 bg-white rounded-3xl border border-slate-100 animate-in slide-in-from-left duration-200">
                              <input placeholder="Articulación" value={g.joint} onChange={e => {
                                const newG = [...evoData.goniometry];
                                newG[i].joint = e.target.value;
                                setEvoData({...evoData, goniometry: newG});
                              }} className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-emerald-200" />
                              <input placeholder="Movimiento" value={g.movement} onChange={e => {
                                const newG = [...evoData.goniometry];
                                newG[i].movement = e.target.value;
                                setEvoData({...evoData, goniometry: newG});
                              }} className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-emerald-200" />
                              <input placeholder="Activo (º)" value={g.activeRange} onChange={e => {
                                const newG = [...evoData.goniometry];
                                newG[i].activeRange = e.target.value;
                                setEvoData({...evoData, goniometry: newG});
                              }} className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-emerald-200" />
                              <input placeholder="Pasivo (º)" value={g.passiveRange} onChange={e => {
                                const newG = [...evoData.goniometry];
                                newG[i].passiveRange = e.target.value;
                                setEvoData({...evoData, goniometry: newG});
                              }} className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-emerald-200" />
                              <button onClick={() => removeGonioRow(i)} className="text-red-400 hover:text-red-600 transition-colors flex items-center justify-center p-2"><Trash2 size={20}/></button>
                           </div>
                         ))}
                         {evoData.goniometry.length === 0 && <p className="text-center py-6 text-slate-300 text-[10px] font-black uppercase italic tracking-[0.2em]">NINGUNO: Sin cambios de rango reportados</p>}
                      </div>
                   </div>
                </section>

                {/* 3. IMPRESIÓN CLÍNICA FINAL (OBLIGATORIO) */}
                <section className="space-y-8 bg-indigo-50/50 p-10 rounded-[3.5rem] border border-indigo-100">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2"><ClipboardCheck size={14}/> Impresión Clínica Final</h4>
                      <div className="flex items-center gap-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EVA:</span>
                        <input type="range" min="0" max="10" value={evoData.pain} onChange={e => setEvoData({...evoData, pain: parseInt(e.target.value)})} className="w-32 accent-red-500" />
                        <span className="text-xl font-black text-red-600 w-12">{evoData.pain}/10</span>
                      </div>
                   </div>
                   <textarea 
                    rows={6} 
                    required
                    value={evoData.impression}
                    onChange={e => setEvoData({...evoData, impression: e.target.value})}
                    className="w-full p-8 rounded-[3rem] bg-white border-2 border-indigo-100 text-slate-800 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-xl leading-relaxed"
                    placeholder="Redacte la evolución, respuesta a las técnicas aplicadas y planificación para el próximo encuentro..."
                   />
                </section>

                <button onClick={handleSaveEvolution} className="w-full py-7 bg-emerald-600 text-white rounded-[3rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                  <CheckCircle2 size={20}/> Guardar y Actualizar Ficha Histórica
                </button>
             </div>
          </div>
        </div>
      )}

      {showLocalCalc && <DosageCalculator onClose={() => setShowLocalCalc(false)} initialWeight={patient.vitalSigns.weight} />}
    </div>
  );
};

const EvoInput = ({ label, value, onChange, type = 'text', color }: any) => (
  <div className={`space-y-2 p-4 rounded-3xl bg-${color}-50/50 border border-${color}-100 transition-all hover:bg-white hover:shadow-md`}>
    <label className={`text-[9px] font-black text-${color}-600 uppercase tracking-widest ml-1`}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className={`w-full bg-transparent outline-none font-black text-sm text-${color}-900`} 
    />
  </div>
);

const SummaryBox = ({ icon: Icon, label, value, color, subValue }: any) => (
  <div className={`bg-${color}-50 p-6 rounded-[2.5rem] border border-${color}-100 border-l-8 border-l-${color}-600 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
    <h4 className={`text-[10px] font-black text-${color}-600 uppercase tracking-widest mb-3 flex items-center gap-2`}><Icon size={14}/> {label}</h4>
    <p className={`text-xs text-${color}-800 font-bold leading-relaxed`}>{value || 'NINGUNO'}</p>
    {subValue && <p className={`text-[9px] text-${color}-500 mt-2 uppercase font-black tracking-tight`}>Nota: {subValue}</p>}
  </div>
);

const VitalBox = ({ label, value, unit, color, highlight = false }: any) => (
  <div className={`bg-white p-5 rounded-[2rem] border ${highlight ? 'border-emerald-500 shadow-xl shadow-emerald-50 scale-110 z-10' : 'border-slate-100'} text-center transition-all hover:translate-y-[-4px]`}>
    <p className="text-[9px] font-black text-slate-300 uppercase mb-2 tracking-widest">{label}</p>
    <p className={`text-base font-black text-${color}-600`}>{value} <span className="text-[9px] opacity-40 uppercase">{unit}</span></p>
  </div>
);

export default ClinicalRecord;
