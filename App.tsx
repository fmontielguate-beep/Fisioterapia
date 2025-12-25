
import React, { useState, useRef } from 'react';
import { PatientInfo, PhysioUser, Appointment, APP_VERSION, Exercise } from './types';
import PhysioAuth from './components/PhysioAuth';
import PhysioDashboard from './components/PhysioDashboard';
import NewPatientForm from './components/NewPatientForm';
import ClinicalRecord from './components/ClinicalRecord';
import ExerciseManager from './components/ExerciseManager';
import ClinicalCalendar from './components/ClinicalCalendar';
import DosageCalculator from './components/DosageCalculator';
import GlobalAssistant from './components/GlobalAssistant';
import LegalConsent from './components/LegalConsent';

const SHARED_EXERCISES: Exercise[] = [
  { id: 'ex1', title: 'Sentadilla en Pared', description: 'Mantén la espalda apoyada y baja lentamente hasta 90º.', category: 'Fuerza', reps: '3 series de 10 reps', videoUrl: 'https://www.youtube.com/results?search_query=wall+squat+physiotherapy' },
  { id: 'ex2', title: 'Puente de Glúteo', description: 'Eleva la cadera manteniendo el core firme.', category: 'Fuerza', reps: '2 series de 15 reps', videoUrl: 'https://www.youtube.com/results?search_query=glute+bridge+physiotherapy' },
  { id: 'ex3', title: 'Movilidad de Tobillo', description: 'De pie, lleva la rodilla hacia la pared.', category: 'Movilidad', reps: '2 series de 12 reps', videoUrl: 'https://www.youtube.com/results?search_query=ankle+mobility+physiotherapy' },
  { id: 'ex4', title: 'Pájaro-Perro (Core)', description: 'En cuadrupedia, extiende brazo y pierna contraria.', category: 'Movilidad', reps: '3 series de 10 reps', videoUrl: 'https://www.youtube.com/results?search_query=bird+dog+exercise+physio' },
  { id: 'ex5', title: 'Estiramiento Pectoral', description: 'En el marco de una puerta, inclínate hacia delante.', category: 'Estiramiento', reps: '3 series de 30s', videoUrl: 'https://www.youtube.com/results?search_query=pectoral+stretch+doorway' }
];

const MOCK_PATIENTS: PatientInfo[] = [
  {
    id: 'p1',
    name: 'Juan Pérez García',
    age: 45,
    idNumber: '12345678X',
    email: 'juan@email.com',
    phone: '600112233',
    condition: 'Post-op LCA Rodilla Izq',
    diagnosis: 'Rotura completa de LCA. Intervención hace 6 semanas (Plastia HTH).',
    admissionDate: '2023-09-15',
    treatmentResponse: 'Evolución favorable con ganancia de rango progresiva.',
    illnessHistory: 'Traumatismo indirecto jugando al fútbol hace 2 meses.',
    treatmentReceived: 'Crioterapia y magnetoterapia inicial.',
    treatmentReason: 'Recuperación funcional post-quirúrgica.',
    warningSigns: 'Riesgo de TVP por inmovilización prolongada inicial.',
    medicalHistory: 'HTA controlada, Ex-fumador.',
    allergies: 'Ninguna conocida.',
    otherTreatments: 'Enalapril 10mg/24h.',
    drugInteractions: 'Evitar AINEs si es posible por control de TA.',
    clinicalFindings: 'Atrofia en vasto medial (-2cm).',
    physicalActivityLevel: 'Activo',
    physicalExam: {
      visualInspection: 'Cicatriz normotrófica, ligero edema infrapatelar.',
      palpation: 'Aumento de temperatura local en cara interna.',
      goniometry: [
        { joint: 'Rodilla Izq', movement: 'Flexión', activeRange: '110', passiveRange: '120' },
        { joint: 'Rodilla Izq', movement: 'Extensión', activeRange: '-5', passiveRange: '0' }
      ],
      orthopedicTests: [{ id: 't1', category: 'Rodilla', testName: 'Lachman', result: 'Negativo', observations: 'Injerto estable.' }]
    },
    referralSource: 'Traumatología Quirón',
    patientType: 'Ambulatorio',
    ambulationType: 'Independiente',
    vitalSigns: { heartRate: 72, respiratoryRate: 16, bloodPressure: '125/80', oxygenSaturation: 98, temperature: 36.6, weight: 82, height: 180, bmi: 25.31 },
    diagnosticStudies: [{ id: 'd1', type: 'Radiología', title: 'RX Post-OP', date: '2023-10-01', resultSummary: 'Material de osteosíntesis en posición.' }],
    progress: 65,
    lastSession: '2023-11-15',
    notes: [{ id: 'n1', date: '2023-11-15', content: 'Iniciamos carga en cadena cinética cerrada.', painLevel: 2, author: 'Fisio Principal', type: 'Evolución' }],
    assignedExercises: [SHARED_EXERCISES[0], SHARED_EXERCISES[1]]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentUserRole, setCurrentUserRole] = useState<'patient' | 'physio' | null>(null);
  const [loggedPhysio, setLoggedPhysio] = useState<PhysioUser | null>(null);
  const [patients, setPatients] = useState<PatientInfo[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientInfo | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const dataStr = JSON.stringify({ patients, appointments, version: APP_VERSION, date: new Date().toISOString() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `backup_fisio_sevilla_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.patients && Array.isArray(json.patients)) {
          if (window.confirm("¿ESTÁ SEGURO? Esta acción reemplazará todos los pacientes actuales.")) {
            setPatients(json.patients);
            if (json.appointments) setAppointments(json.appointments);
            alert("Base de datos restaurada.");
          }
        }
      } catch (err) { alert("Error al leer el archivo."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdatePlan = (patientId: string, exercises: Exercise[]) => {
    setPatients(prev => {
      const updatedList = prev.map(p => p.id === patientId ? { ...p, assignedExercises: exercises } : p);
      if (selectedPatient?.id === patientId) setSelectedPatient({ ...selectedPatient, assignedExercises: exercises });
      return updatedList;
    });
  };

  const handleUpdatePatient = (updated: PatientInfo) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedPatient(updated);
  };

  const enterDemoMode = () => {
    setCurrentUserRole('physio');
    setLoggedPhysio({ id: 'demo-1', name: 'Fisio Demo', professionalId: 'DEMO-2024', specialty: 'EBP Specialist' });
    setCurrentView('physio-dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight">FisioSevilla <span className="text-emerald-600">Pro</span></h1>
            <p className="text-slate-500 font-medium italic">Gestión Clínica Avanzada v2.7.5</p>
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button onClick={enterDemoMode} className="bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl shadow-emerald-100 border-2 border-emerald-500 hover:bg-emerald-700 transition-all active:scale-95">Modo Demo Profesional</button>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => {setCurrentUserRole('physio'); setCurrentView('physio-auth');}} className="bg-white border border-slate-200 py-3 rounded-xl font-bold text-[10px] uppercase text-slate-400">Portal Fisio</button>
                <button onClick={() => {setCurrentUserRole('patient'); setCurrentView('legal-consent');}} className="bg-white border border-slate-200 py-3 rounded-xl font-bold text-[10px] uppercase text-slate-400">Portal Paciente</button>
              </div>
            </div>
            <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">{APP_VERSION} · ANDALUCÍA SALUD</p>
          </div>
        );

      case 'physio-dashboard':
        return (
          <div className="min-h-screen bg-slate-50 px-6 py-10 max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-end gap-3 mb-8">
               <input type="file" ref={fileInputRef} onChange={handleImportData} className="hidden" accept=".json" />
               <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase text-indigo-600">Importar</button>
               <button onClick={handleExportData} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase text-emerald-600">Exportar</button>
               <button onClick={() => setCurrentView('exercise-manager')} className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all">Plan de Trabajo</button>
               <button onClick={() => setShowCalculator(true)} className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-blue-600">Calculadora</button>
               <button onClick={() => setShowCalendar(true)} className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-emerald-600">Agenda</button>
               <button onClick={() => setCurrentView('landing')} className="bg-red-50 border border-red-100 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase text-red-600">Salir</button>
            </div>
            <PhysioDashboard 
              patients={patients} 
              onSelectPatient={(p) => { setSelectedPatient(p); setCurrentView('clinical-record'); }}
              onDeletePatient={(id) => { if(window.confirm("¿Eliminar?")) setPatients(prev => prev.filter(p => p.id !== id)) }}
              onAddNew={() => { setEditingPatient(null); setCurrentView('new-patient'); }}
              onManualSave={handleExportData}
              lastSaved={new Date().toLocaleTimeString()}
            />
          </div>
        );

      case 'clinical-record':
        if (!selectedPatient) return null;
        return (
          <div className="min-h-screen bg-slate-50 px-6 py-10 max-w-7xl mx-auto">
            <ClinicalRecord 
              patient={selectedPatient} 
              onBack={() => setCurrentView('physio-dashboard')} 
              onManagePlan={() => setCurrentView('exercise-manager')}
              onUpdatePatient={handleUpdatePatient}
              onEditProfile={() => { setEditingPatient(selectedPatient); setCurrentView('new-patient'); }}
              onDeletePatient={(id) => { setPatients(prev => prev.filter(p => p.id !== id)); setCurrentView('physio-dashboard'); }}
              onOpenCalendar={() => setShowCalendar(true)}
            />
          </div>
        );

      case 'new-patient':
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <NewPatientForm 
              initialPatient={editingPatient || undefined}
              onSave={(p) => {
                if (editingPatient) handleUpdatePatient(p);
                else setPatients([...patients, p]);
                setCurrentView('physio-dashboard');
                setEditingPatient(null);
              }} 
              onCancel={() => { setCurrentView(editingPatient ? 'clinical-record' : 'physio-dashboard'); setEditingPatient(null); }} 
            />
          </div>
        );

      case 'exercise-manager':
        return (
          <div className="min-h-screen bg-slate-50 px-6 py-10 max-w-7xl mx-auto">
            <ExerciseManager 
              patients={patients} 
              initialSelectedPatient={selectedPatient} 
              onUpdatePlan={handleUpdatePlan} 
              onBack={() => {
                if(selectedPatient) setCurrentView('clinical-record');
                else setCurrentView('physio-dashboard');
              }} 
            />
          </div>
        );

      default:
        return <div className="min-h-screen bg-slate-50 p-6"><LegalConsent onConsent={() => setCurrentView('landing')} onBack={() => setCurrentView('landing')} /></div>;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-100">
      {renderView()}
      {showCalendar && (
        <ClinicalCalendar 
          onClose={() => setShowCalendar(false)} 
          patients={patients} 
          appointments={appointments} 
          onAddAppointment={(a) => setAppointments([...appointments, a])}
          onSelectPatient={(p) => { setSelectedPatient(p); setCurrentView('clinical-record'); setShowCalendar(false); }}
        />
      )}
      {showCalculator && <DosageCalculator onClose={() => setShowCalculator(false)} initialWeight={selectedPatient?.vitalSigns.weight} />}
      <GlobalAssistant role={currentUserRole || 'patient'} user={currentUserRole === 'physio' ? loggedPhysio : (patients[0] || null)} version={APP_VERSION} />
    </div>
  );
}
