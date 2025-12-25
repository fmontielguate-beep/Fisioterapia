
// DO NOT add any new files, classes, or namespaces.
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  BookOpen, 
  MessageSquare, 
  Home, 
  X,
  ChevronRight,
  TrendingUp,
  PlusCircle,
  Settings,
  FolderHeart,
  UserPlus,
  Users,
  User,
  LogOut,
  AlertCircle,
  FlaskConical,
  ShieldCheck,
  Database,
  ClipboardList,
  Menu,
  CloudCheck,
  Stethoscope,
  Microscope,
  BrainCircuit,
  Calculator,
  Calendar as CalendarIcon
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PhysioDashboard from './components/PhysioDashboard';
import ClinicalRecord from './components/ClinicalRecord';
import NewPatientForm from './components/NewPatientForm';
import ExerciseLibrary from './components/ExerciseLibrary';
import ExerciseManager from './components/ExerciseManager';
import Chat from './components/Chat';
import Monitoring from './components/Monitoring';
import PREMForm from './components/PREMForm';
import LegalConsent from './components/LegalConsent';
import PhysioAuth from './components/PhysioAuth';
import GlobalAssistant from './components/GlobalAssistant';
import DosageCalculator from './components/DosageCalculator';
import ClinicalCalendar from './components/ClinicalCalendar';
import { UserRole, PatientInfo, Exercise, PhysioUser, Appointment } from './types';

type AppEnv = 'demo' | 'final' | null;

const APP_VERSION = "v2.6.5-Clinical"; 

const App: React.FC = () => {
  const [env, setEnv] = useState<AppEnv>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [currentPhysio, setCurrentPhysio] = useState<PhysioUser | null>(null);
  const [hasConsented, setHasConsented] = useState(false); 
  
  const [showGlobalCalculator, setShowGlobalCalculator] = useState(false);
  const [showGlobalCalendar, setShowGlobalCalendar] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const demoPatients: PatientInfo[] = [
    {
      id: 'demo-1',
      name: 'Juan Pérez Jiménez',
      age: 42,
      idNumber: '12345678X',
      email: 'juan.perez@email.com',
      phone: '600123456',
      condition: 'Post-op Rodilla',
      diagnosis: 'Rotura de menisco interno intervenida. Plastia de LCA.',
      admissionDate: '2023-09-10',
      treatmentResponse: 'Evolución muy positiva tras 12 sesiones.',
      illnessHistory: 'Paciente que sufre torsión brusca de rodilla derecha practicando pádel.',
      treatmentReceived: 'Cinesiterapia pasiva, control de inflamación y potenciación isométrica.',
      treatmentReason: 'Recuperación funcional para vuelta al deporte.',
      warningSigns: 'Edema grave recurrente.',
      medicalHistory: 'Sin antecedentes relevantes.',
      otherTreatments: 'Ninguno.',
      clinicalFindings: '',
      physicalActivityLevel: 'Activo',
      physicalExam: {
        visualInspection: 'Ligero edema infrapatelar en rodilla derecha. Cicatrices quirúrgicas estables.',
        palpation: 'Punto doloroso en interlínea medial. Tono muscular del cuádriceps disminuido.',
        goniometry: [
          { joint: 'Rodilla D', movement: 'Flexión', activeRange: '105', passiveRange: '115' },
          { joint: 'Rodilla D', movement: 'Extensión', activeRange: '-5', passiveRange: '0' }
        ],
        orthopedicTests: [
          { id: 't1', category: 'Rodilla', testName: 'Test de Lachman', result: 'Negativo', observations: 'Tope final firme.' }
        ]
      },
      drugInteractions: 'Ninguna.',
      referralSource: 'Traumatología',
      patientType: 'Ambulatorio',
      ambulationType: 'Independiente',
      vitalSigns: { 
        heartRate: 72, 
        respiratoryRate: 16, 
        bloodPressure: '120/80', 
        oxygenSaturation: 98, 
        temperature: 36.5,
        weight: 82,
        height: 178,
        bmi: 25.88
      },
      diagnosticStudies: [],
      progress: 45,
      lastSession: 'Hace 2 días',
      notes: [],
      assignedExercises: [
        { id: '1', title: 'Sentadilla en Pared', description: 'Mantén la espalda apoyada.', category: 'Fuerza', reps: '3 series de 10 reps' }
      ]
    },
    {
      id: 'demo-2',
      name: 'Elena García Martín',
      age: 55,
      idNumber: '87654321B',
      email: 'elena.garcia@email.com',
      phone: '655987432',
      condition: 'Hombro Doloroso',
      diagnosis: 'Tendinopatía del supraespinoso con calcificación incipiente.',
      admissionDate: '2023-10-05',
      treatmentResponse: 'Reducción notable del dolor nocturno.',
      illnessHistory: 'Inicio insidioso hace 3 meses, dolor al levantar el brazo lateralmente.',
      treatmentReceived: 'Terapia manual, punción seca y ondas de choque.',
      treatmentReason: 'Limitación en actividades de la vida diaria.',
      warningSigns: 'Dolor irradiado al codo.',
      medicalHistory: 'Hipertensión controlada.',
      otherTreatments: 'AINEs pautados por médico de cabecera.',
      clinicalFindings: '',
      physicalActivityLevel: 'Sedentario',
      physicalExam: {
        visualInspection: 'Disquinesia escapular derecha leve. Atrofia fosa supraespinosa.',
        palpation: 'Dolor exquisito en troquiter. Hipertonía en trapecio superior.',
        goniometry: [
          { joint: 'Hombro D', movement: 'Abducción', activeRange: '85', passiveRange: '110' },
          { joint: 'Hombro D', movement: 'Flexión', activeRange: '140', passiveRange: '160' }
        ],
        orthopedicTests: [
          { id: 't2', category: 'Hombro', testName: 'Signo de Jobe (Empty Can)', result: 'Positivo', observations: 'Dolor intenso a la resistencia.' },
          { id: 't3', category: 'Hombro', testName: 'Test de Hawkins-Kennedy', result: 'Positivo', observations: 'Compromiso subacromial evidente.' }
        ]
      },
      drugInteractions: 'Ninguna conocida.',
      referralSource: 'Médico de Familia',
      patientType: 'Ambulatorio',
      ambulationType: 'Independiente',
      vitalSigns: { 
        heartRate: 68, 
        respiratoryRate: 14, 
        bloodPressure: '135/85', 
        oxygenSaturation: 97, 
        temperature: 36.6,
        weight: 65,
        height: 162,
        bmi: 24.77
      },
      diagnosticStudies: [],
      progress: 30,
      lastSession: 'Ayer',
      notes: [],
      assignedExercises: [
        { id: '4', title: 'Movilidad Escapular', description: 'Rota los hombros suavemente.', category: 'Movilidad', reps: '2 series de 15 reps' }
      ]
    },
    {
      id: 'demo-3',
      name: 'Carlos Ruiz Soler',
      age: 30,
      idNumber: '44556677K',
      email: 'carlos.ruiz@email.com',
      phone: '611223344',
      condition: 'Hernia Discal L5-S1',
      diagnosis: 'Radiculopatía S1 izquierda por hernia extrusa.',
      admissionDate: '2023-11-02',
      treatmentResponse: 'Inestabilidad en la fuerza de flexión plantar.',
      illnessHistory: 'Episodio de dolor agudo tras levantamiento de carga pesada.',
      treatmentReceived: 'Tracción manual, neurodinamia del nervio ciático.',
      treatmentReason: 'Evitar intervención quirúrgica.',
      warningSigns: 'Pérdida de fuerza en el pie (parestesias).',
      medicalHistory: 'Fumador ocasional.',
      otherTreatments: 'Pregabalina 75mg.',
      clinicalFindings: '',
      physicalActivityLevel: 'Leve',
      physicalExam: {
        visualInspection: 'Shift lateral derecho (antálgico). Aplanamiento lordosis lumbar.',
        palpation: 'Contractura paravertebral bilateral. Sensibilidad disminuida en dermatoma S1.',
        goniometry: [
          { joint: 'Lumbares', movement: 'Flexión Tronco', activeRange: '30', passiveRange: '45' }
        ],
        orthopedicTests: [
          { id: 't4', category: 'Columna Lumbar', testName: 'Test de Lasegue (SLR)', result: 'Positivo', observations: 'Dolor a los 40º en pierna izquierda.' },
          { id: 't5', category: 'Columna Lumbar', testName: 'Test de Bragard', result: 'Positivo', observations: 'Aumenta componente radicular.' }
        ]
      },
      drugInteractions: 'Controlar efecto sedante de medicación.',
      referralSource: 'Neurocirugía',
      patientType: 'Ambulatorio',
      ambulationType: 'Independiente con limitación',
      vitalSigns: { 
        heartRate: 80, 
        respiratoryRate: 18, 
        bloodPressure: '110/70', 
        oxygenSaturation: 99, 
        temperature: 36.4,
        weight: 90,
        height: 185,
        bmi: 26.3
      },
      diagnosticStudies: [],
      progress: 15,
      lastSession: 'Hoy',
      notes: [],
      assignedExercises: [
        { id: '3', title: 'Estiramiento Isquiotibial', description: 'Usa una toalla para asistir el estiramiento.', category: 'Estiramiento', reps: '3 series de 30s' }
      ]
    },
    {
      id: 'demo-4',
      name: 'Sofía Méndez Ruiz',
      age: 22,
      idNumber: '99001122L',
      email: 'sofia.mendez@email.com',
      phone: '699000111',
      condition: 'Esguince Tobillo',
      diagnosis: 'Esguince Grado II del ligamento lateral externo (LPAA).',
      admissionDate: '2023-11-20',
      treatmentResponse: 'Disminución rápida del hematoma y dolor.',
      illnessHistory: 'Inversión forzada del tobillo derecho durante entrenamiento de fútbol.',
      treatmentReceived: 'Drenaje linfático manual, vendaje funcional.',
      treatmentReason: 'Retorno seguro a la competición.',
      warningSigns: 'Inestabilidad crónica percibida.',
      medicalHistory: 'Esguinces previos en el mismo pie.',
      otherTreatments: 'Crioterapia domiciliaria.',
      clinicalFindings: '',
      physicalActivityLevel: 'Muy Activo',
      physicalExam: {
        visualInspection: 'Edema maleolar externo (signo de la clara de huevo). Equimosis.',
        palpation: 'Dolor a la palpación del ligamento peroneoastragalino anterior.',
        goniometry: [
          { joint: 'Tobillo D', movement: 'Flexión Dorsal', activeRange: '5', passiveRange: '10' },
          { joint: 'Tobillo D', movement: 'Flexión Plantar', activeRange: '30', passiveRange: '45' }
        ],
        orthopedicTests: [
          { id: 't6', category: 'Tobillo/Pie', testName: 'Cajón Anterior Tobillo', result: 'Positivo', observations: 'Laxitud aumentada respecto a contralateral.' },
          { id: 't7', category: 'Tobillo/Pie', testName: 'Prueba de Thompson', result: 'Negativo', observations: 'Tendón de Aquiles íntegro.' }
        ]
      },
      drugInteractions: 'Ninguna.',
      referralSource: 'Club Deportivo',
      patientType: 'Ambulatorio',
      ambulationType: 'Carga parcial (con muletas)',
      vitalSigns: { 
        heartRate: 58, 
        respiratoryRate: 14, 
        bloodPressure: '105/65', 
        oxygenSaturation: 100, 
        temperature: 36.2,
        weight: 58,
        height: 168,
        bmi: 20.55
      },
      diagnosticStudies: [],
      progress: 10,
      lastSession: 'Hoy',
      notes: [],
      assignedExercises: [
        { id: '4', title: 'Movilidad de Tobillo', description: 'Dibuja el alfabeto con el pie.', category: 'Movilidad', reps: '3 series' }
      ]
    }
  ];

  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const savedPatients = localStorage.getItem('fisio_sevilla_patients');
    const savedAppts = localStorage.getItem('fisio_sevilla_appointments');
    
    if (env === 'final') {
      if (savedPatients) setPatients(JSON.parse(savedPatients));
      if (savedAppts) setAppointments(JSON.parse(savedAppts));
    }
  }, [env]);

  useEffect(() => {
    if (env === 'final') {
      localStorage.setItem('fisio_sevilla_patients', JSON.stringify(patients));
      localStorage.setItem('fisio_sevilla_appointments', JSON.stringify(appointments));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [patients, appointments, env]);

  const handleSelectEnv = (selectedEnv: AppEnv) => {
    setEnv(selectedEnv);
    if (selectedEnv === 'demo') {
      setPatients(demoPatients);
      setAppointments([
        { id: 'a1', patientId: 'demo-1', patientName: 'Juan Pérez Jiménez', date: new Date().toISOString().split('T')[0], time: '10:30', type: 'Tratamiento' },
        { id: 'a2', patientId: 'demo-3', patientName: 'Carlos Ruiz Soler', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'Evaluación' }
      ]);
    }
  };

  const handleManualSave = useCallback(() => {
    localStorage.setItem('fisio_sevilla_patients', JSON.stringify(patients));
    localStorage.setItem('fisio_sevilla_appointments', JSON.stringify(appointments));
    setLastSaved(new Date().toLocaleTimeString());
    
    const feedback = document.createElement('div');
    feedback.className = "fixed bottom-8 right-8 bg-green-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl z-[200] animate-in slide-in-from-bottom duration-500 font-bold flex items-center gap-3";
    feedback.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Base de datos actualizada`;
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom');
      setTimeout(() => feedback.remove(), 500);
    }, 3000);
  }, [patients, appointments]);

  const handleSelectPatient = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setCurrentView('clinical-record');
  };

  const handleUpdatePatient = (updatedPatient: PatientInfo) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    if (selectedPatient?.id === updatedPatient.id) setSelectedPatient(updatedPatient);
  };

  const handleDeletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(a => a.patientId !== id));
    if (selectedPatient?.id === id) {
      setSelectedPatient(null);
      setCurrentView('physio-dashboard');
    }
  };

  const handleAddAppointment = (appt: Appointment) => {
    setAppointments(prev => [...prev, appt]);
  };

  const handleLogout = () => {
    setEnv(null); setRole(null); setHasConsented(false); setCurrentPhysio(null); setShowLogoutModal(false); setCurrentView('dashboard'); setSelectedPatient(null);
  };

  const renderView = () => {
    if (role === 'patient') {
      const activePatient = patients.length > 0 ? patients[0] : demoPatients[0];
      switch (currentView) {
        case 'dashboard': return <Dashboard setView={setCurrentView} patient={activePatient} />;
        case 'exercises': return <ExerciseLibrary />;
        case 'chat': return <Chat recipientName="Fisio Manuel García" />;
        case 'monitoring': return <Monitoring />;
        case 'prem': return <PREMForm />;
        default: return <Dashboard setView={setCurrentView} patient={activePatient} />;
      }
    } else {
      switch (currentView) {
        case 'physio-dashboard': return <PhysioDashboard patients={patients} onSelectPatient={handleSelectPatient} onDeletePatient={handleDeletePatient} onAddNew={() => setCurrentView('new-patient')} onManualSave={handleManualSave} lastSaved={lastSaved} />;
        case 'new-patient': return <NewPatientForm onSave={(p) => { setPatients([...patients, p]); setCurrentView('physio-dashboard'); }} onCancel={() => setCurrentView('physio-dashboard')} />;
        case 'clinical-record': return selectedPatient ? <ClinicalRecord patient={selectedPatient} onBack={() => setCurrentView('physio-dashboard')} onManagePlan={() => setCurrentView('exercise-manager')} onUpdatePatient={handleUpdatePatient} onDeletePatient={handleDeletePatient} onOpenCalendar={() => setShowGlobalCalendar(true)} /> : null;
        case 'exercise-manager': return <ExerciseManager patients={patients} initialSelectedPatient={selectedPatient} onUpdatePlan={(pid, exes) => setPatients(prev => prev.map(p => p.id === pid ? {...p, assignedExercises: exes} : p))} />;
        default: return <PhysioDashboard patients={patients} onSelectPatient={handleSelectPatient} onDeletePatient={handleDeletePatient} onAddNew={() => setCurrentView('new-patient')} onManualSave={handleManualSave} lastSaved={lastSaved} />;
      }
    }
  };

  if (!env) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="max-w-4xl w-full z-10 space-y-12 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
          <header className="text-center space-y-4">
            <Activity className="w-20 h-20 text-emerald-400 mx-auto" />
            <h1 className="text-6xl font-black tracking-tighter">FisioSevilla <span className="text-blue-500">Digital</span></h1>
            <p className="text-slate-400 text-xl font-medium tracking-wide">Plataforma de Rehabilitación y Gestión Clínica v2.6</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            <div onClick={() => handleSelectEnv('demo')} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-orange-500/10 hover:border-orange-500/50 transition-all cursor-pointer group text-center space-y-8 backdrop-blur-xl">
              <div className="w-24 h-24 bg-orange-500/20 text-orange-400 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl"><FlaskConical size={48} /></div>
              <div><h2 className="text-3xl font-bold">Modo Demo</h2><p className="text-slate-400 mt-3 text-sm leading-relaxed">Explora con datos precargados clínicos variados.</p></div>
              <div className="text-orange-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-1">Probar <ChevronRight size={16} /></div>
            </div>
            <div onClick={() => handleSelectEnv('final')} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-blue-600/10 hover:border-blue-500/50 transition-all cursor-pointer group text-center space-y-8 backdrop-blur-xl">
              <div className="w-24 h-24 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl"><ShieldCheck size={48} /></div>
              <div><h2 className="text-3xl font-bold">Modo Final</h2><p className="text-slate-400 mt-3 text-sm leading-relaxed">Uso clínico real persistente.</p></div>
              <div className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-1">Entrar <ChevronRight size={16} /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <button onClick={() => setEnv(null)} className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 transition-colors"><X size={16} /> Volver</button>
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <div onClick={() => { setRole('patient'); setCurrentView('dashboard'); }} className="bg-white p-14 rounded-[4rem] shadow-2xl hover:shadow-blue-200 transition-all cursor-pointer group border-2 border-transparent hover:border-blue-500 text-center space-y-8">
            <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:rotate-6 transition-transform shadow-lg"><User size={56} /></div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Paciente</h2>
            <div className="bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200 group-hover:bg-blue-700 transition-colors">Mi Portal</div>
          </div>
          <div onClick={() => { setRole('physio'); setCurrentView('physio-dashboard'); }} className="bg-white p-14 rounded-[4rem] shadow-2xl hover:shadow-green-200 transition-all cursor-pointer group border-2 border-transparent hover:border-emerald-500 text-center space-y-8">
            <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto group-hover:-rotate-6 transition-transform shadow-lg"><Stethoscope size={56} /></div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Clínico</h2>
            <div className="bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-200 group-hover:bg-emerald-700 transition-colors">Panel Científico</div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'physio' && !currentPhysio) return <PhysioAuth onLogin={setCurrentPhysio} onBack={() => setRole(null)} />;
  if (role === 'patient' && !hasConsented) return <LegalConsent onConsent={() => setHasConsented(true)} onBack={() => setRole(null)} />;

  const navItems = role === 'patient' 
    ? [
        { id: 'dashboard', label: 'Inicio', icon: Home },
        { id: 'exercises', label: 'Ejercicios', icon: BookOpen },
        { id: 'monitoring', label: 'Sesión IA', icon: Activity },
        { id: 'chat', label: 'Mensajes', icon: MessageSquare },
        { id: 'prem', label: 'Evaluación', icon: ClipboardList },
      ]
    : [
        { id: 'physio-dashboard', label: 'Pacientes', icon: FolderHeart },
        { id: 'new-patient', label: 'Nueva HCE', icon: UserPlus },
        { id: 'exercise-manager', label: 'Planes', icon: PlusCircle },
      ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden h-screen">
      
      {showGlobalCalculator && <DosageCalculator onClose={() => setShowGlobalCalculator(false)} />}
      {showGlobalCalendar && <ClinicalCalendar onClose={() => setShowGlobalCalendar(false)} patients={patients} appointments={appointments} onAddAppointment={handleAddAppointment} onSelectPatient={handleSelectPatient} />}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><AlertCircle size={40} /></div>
            <h3 className="text-2xl font-black text-center text-slate-800 tracking-tight">¿Cerrar Sesión?</h3>
            <p className="text-slate-500 text-center mt-3 mb-10 text-sm leading-relaxed">Tus datos están protegidos. No olvides guardar antes de salir.</p>
            <div className="flex flex-col gap-4">
              <button onClick={handleLogout} className="w-full bg-red-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 hover:bg-red-600 transition-all">Salir con Seguridad</button>
              <button onClick={() => setShowLogoutModal(false)} className="w-full bg-slate-50 text-slate-600 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 shadow-2xl transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className={`p-10 text-white rounded-br-[4rem] shadow-2xl ${role === 'physio' ? 'bg-emerald-800' : 'bg-blue-700'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg">
                {role === 'physio' ? <Stethoscope className="w-8 h-8 text-white" /> : <Activity className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tighter">FisioSevilla</h1>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">{role === 'physio' ? 'Ciencia Clínica' : 'Portal Paciente'}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 bg-black/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                {role === 'physio' ? <Microscope size={20} /> : <User size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{role === 'physio' ? 'Personal Clínico' : 'Paciente'}</p>
                <p className="text-sm font-bold truncate">{role === 'physio' ? currentPhysio?.name : patients[0]?.name || 'Usuario'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 mt-8 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const activeColor = role === 'physio' ? 'bg-emerald-600' : 'bg-blue-600';
              return (
                <button key={item.id} onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-300 relative group ${isActive ? `${activeColor} text-white shadow-xl` : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon className="w-6 h-6" /><span className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                </button>
              );
            })}
            
            {role === 'physio' && (
              <div className="pt-8 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-6 mb-4">Herramientas</p>
                <button onClick={() => setShowGlobalCalendar(true)} className="w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm">
                  <CalendarIcon className="w-5 h-5" /> <span>Agenda de Citas</span>
                </button>
                <button onClick={() => setShowGlobalCalculator(true)} className="w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-all font-bold text-sm">
                  <Calculator className="w-5 h-5" /> <span>Calculadora Dosis</span>
                </button>
              </div>
            )}
          </nav>

          <div className="p-8 border-t border-slate-50">
            <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"><LogOut size={14} /> Salir del Sistema</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-slate-50/50 h-full scroll-smooth">
        <header className={`md:hidden ${role === 'physio' ? 'bg-emerald-800' : 'bg-blue-700'} text-white p-5 flex justify-between items-center sticky top-0 z-40 shadow-xl`}>
          <div className="flex items-center gap-3"><Activity className="w-6 h-6 text-white" /><span className="font-black text-lg tracking-tight">FisioSevilla</span></div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/10 rounded-2xl active:scale-90 transition-transform"><Menu className="w-6 h-6" /></button>
        </header>
        <div className="p-4 md:p-12 lg:p-16 max-w-7xl mx-auto">{renderView()}</div>
        {(currentPhysio || hasConsented) && <GlobalAssistant role={role} user={role === 'physio' ? currentPhysio : patients[0]} />}
      </main>
    </div>
  );
};

export default App;
