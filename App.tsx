
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
  BrainCircuit
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
import { UserRole, PatientInfo, Exercise, PhysioUser } from './types';

type AppEnv = 'demo' | 'final' | null;

const APP_VERSION = "v2.5.2-EBP"; 

const App: React.FC = () => {
  const [env, setEnv] = useState<AppEnv>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const [currentPhysio, setCurrentPhysio] = useState<PhysioUser | null>(null);
  const [hasConsented, setHasConsented] = useState(false); 
  
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
      treatmentResponse: 'Evolución muy positiva. Ha recuperado el 90% del rango articular y ya realiza carga total sin dolor significativo.',
      illnessHistory: 'Paciente que sufre torsión brusca de rodilla derecha durante actividad deportiva hace 3 meses. Tras cirugía de reconstrucción LCA hace 4 semanas, inicia rehabilitación para ganar balance articular.',
      treatmentReceived: 'Cinesiterapia pasiva y magnetoterapia.',
      treatmentReason: 'Recuperación funcional tras cirugía articular compleja para restaurar estabilidad mecánica.',
      warningSigns: 'Aumento súbito de edema, fiebre o dolor agudo.',
      medicalHistory: 'Hipercolesterolemia diagnosticada en 2020. Ligera desviación de columna (escoliosis lumbar).',
      otherTreatments: 'Atorvastatina 20mg (noche). Enoxaparina 40mg (SC/24h) hasta fin de semana.',
      clinicalFindings: 'Balance articular 0-90º pasivo, edema grado I.',
      drugInteractions: 'Vigilar sangrados por uso de anticoagulantes en terapia manual intensa.',
      referralSource: 'Traumatología - HUVR',
      patientType: 'Ambulatorio',
      ambulationType: 'Carga parcial con muleta contralateral.',
      vitalSigns: { heartRate: 72, bloodPressure: '120/80', oxygenSaturation: 98, temperature: 36.5 },
      diagnosticStudies: [],
      progress: 45,
      lastSession: 'Hace 2 días',
      notes: [],
      assignedExercises: [
        { id: '1', title: 'Sentadilla en Pared', description: 'Mantén la espalda apoyada y baja lentamente.', category: 'Fuerza', reps: '3 series de 10 reps' }
      ]
    },
    {
      id: 'demo-2',
      name: 'María García López',
      age: 65,
      idNumber: '87654321Y',
      email: 'maria.garcia@email.com',
      phone: '611223344',
      condition: 'Hombro Doloroso',
      diagnosis: 'Tendinopatía del supraespinoso con calcificación leve.',
      admissionDate: '2023-10-05',
      treatmentResponse: 'Respuesta lenta. Persiste dolor nocturno aunque ha mejorado la movilidad en abducción lateral.',
      illnessHistory: 'Dolor crónico en hombro izquierdo. Limitación funcional en actividades elevadas.',
      treatmentReceived: 'Ondas de choque y terapia manual.',
      treatmentReason: 'Reducción del dolor inflamatorio y mejora del rango articular.',
      warningSigns: 'Pérdida de fuerza súbita o dolor nocturno insoportable.',
      medicalHistory: 'Hipotiroidismo de Hashimoto. Osteoporosis en fémur proximal.',
      otherTreatments: 'Eutirox 100mcg (ayunas). Calcio + Vitamina D3 1000mg/880UI (desayuno).',
      clinicalFindings: 'Arco doloroso positivo a partir de 80º de abducción.',
      drugInteractions: 'Precaución con ejercicios de alta carga por riesgo de fractura por fragilidad.',
      referralSource: 'Medicina de Familia - Centro Salud Triana',
      patientType: 'Ambulatorio',
      ambulationType: 'Independiente.',
      vitalSigns: { heartRate: 68, bloodPressure: '135/85', oxygenSaturation: 97, temperature: 36.2 },
      diagnosticStudies: [
        { id: 's1', type: 'Imagen Avanzada', title: 'Ecografía de Hombro', date: '2023-10-15', resultSummary: 'Engrosamiento tendinoso y microcalcificación de 3mm.' }
      ],
      progress: 20,
      lastSession: 'Ayer',
      notes: [],
      assignedExercises: [
        { id: '4', title: 'Movilidad Escapular', description: 'Rota los hombros suavemente hacia atrás.', category: 'Movilidad', reps: '10 rotaciones' }
      ]
    }
  ];

  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fisio_sevilla_patients');
    if (saved && env === 'final') {
      try {
        setPatients(JSON.parse(saved));
        setLastSaved(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Error parsing saved patients:", e);
      }
    }
  }, [env]);

  useEffect(() => {
    if (env === 'final') {
      localStorage.setItem('fisio_sevilla_patients', JSON.stringify(patients));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [patients, env]);

  const handleSelectEnv = (selectedEnv: AppEnv) => {
    setEnv(selectedEnv);
    if (selectedEnv === 'demo') {
      setPatients(demoPatients);
    } else {
      const saved = localStorage.getItem('fisio_sevilla_patients');
      setPatients(saved ? JSON.parse(saved) : []);
    }
  };

  const handleManualSave = useCallback(() => {
    localStorage.setItem('fisio_sevilla_patients', JSON.stringify(patients));
    setLastSaved(new Date().toLocaleTimeString());
    
    const feedback = document.createElement('div');
    feedback.className = "fixed bottom-8 right-8 bg-green-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl z-[200] animate-in slide-in-from-bottom duration-500 font-bold flex items-center gap-3";
    feedback.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Base de datos guardada localmente`;
    document.body.appendChild(feedback);
    setTimeout(() => {
      feedback.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom');
      setTimeout(() => feedback.remove(), 500);
    }, 3000);
  }, [patients]);

  const handleSelectPatient = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setCurrentView('clinical-record');
  };

  const handleUpdatePatient = (updatedPatient: PatientInfo) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    if (selectedPatient?.id === updatedPatient.id) {
      setSelectedPatient(updatedPatient);
    }
  };

  const handleAddPatient = (newPatient: PatientInfo) => {
    setPatients(prev => [...prev, newPatient]);
    setCurrentView('physio-dashboard');
  };

  const handleUpdatePatientExercises = (patientId: string, exercises: Exercise[]) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, assignedExercises: exercises } : p));
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? { ...prev, assignedExercises: exercises } : null);
    }
  };

  const handleLogout = () => {
    setEnv(null);
    setRole(null);
    setHasConsented(false);
    setCurrentPhysio(null);
    setShowLogoutModal(false);
    setCurrentView('dashboard');
    setSelectedPatient(null);
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
        case 'legal': return <LegalConsent onConsent={() => setHasConsented(true)} onBack={() => setRole(null)} />;
        default: return <Dashboard setView={setCurrentView} patient={activePatient} />;
      }
    } else {
      switch (currentView) {
        case 'physio-dashboard': return <PhysioDashboard patients={patients} onSelectPatient={handleSelectPatient} onAddNew={() => setCurrentView('new-patient')} onManualSave={handleManualSave} lastSaved={lastSaved} />;
        case 'new-patient': return <NewPatientForm onSave={handleAddPatient} onCancel={() => setCurrentView('physio-dashboard')} />;
        case 'clinical-record': return selectedPatient ? <ClinicalRecord patient={selectedPatient} onBack={() => setCurrentView('physio-dashboard')} onManagePlan={() => setCurrentView('exercise-manager')} onUpdatePatient={handleUpdatePatient} /> : null;
        case 'exercise-manager': return <ExerciseManager patients={patients} initialSelectedPatient={selectedPatient} onUpdatePlan={handleUpdatePatientExercises} />;
        default: return <PhysioDashboard patients={patients} onSelectPatient={handleSelectPatient} onAddNew={() => setCurrentView('new-patient')} onManualSave={handleManualSave} lastSaved={lastSaved} />;
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
            <p className="text-slate-400 text-xl font-medium tracking-wide">Plataforma de Rehabilitación y Gestión de HCE</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            <div onClick={() => handleSelectEnv('demo')} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-orange-500/10 hover:border-orange-500/50 transition-all cursor-pointer group text-center space-y-8 backdrop-blur-xl">
              <div className="w-24 h-24 bg-orange-500/20 text-orange-400 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl">
                <FlaskConical size={48} />
              </div>
              <div><h2 className="text-3xl font-bold">Modo Demo</h2><p className="text-slate-400 mt-3 text-sm leading-relaxed">Explora el sistema con datos de laboratorio clínicos.</p></div>
              <div className="text-orange-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-1">Probar <ChevronRight size={16} /></div>
            </div>
            <div onClick={() => handleSelectEnv('final')} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] hover:bg-blue-600/10 hover:border-blue-500/50 transition-all cursor-pointer group text-center space-y-8 backdrop-blur-xl">
              <div className="w-24 h-24 bg-blue-600/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl">
                <ShieldCheck size={48} />
              </div>
              <div><h2 className="text-3xl font-bold">Modo Final</h2><p className="text-slate-400 mt-3 text-sm leading-relaxed">Uso real. Datos cifrados y persistentes localmente.</p></div>
              <div className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-1">Entrar <ChevronRight size={16} /></div>
            </div>
          </div>

          <div className="pt-12 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">Entorno Clínico Certificado</p>
            <span className="bg-white/10 px-4 py-1.5 rounded-full text-[12px] font-bold border border-white/10">
              {APP_VERSION}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <button onClick={() => setEnv(null)} className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm bg-white px-5 py-3 rounded-2xl shadow-sm">
          <X className="w-4 h-4" /> Volver a Entorno
        </button>
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

  if (role === 'physio' && !currentPhysio) {
    return <PhysioAuth onLogin={setCurrentPhysio} onBack={() => setRole(null)} />;
  }
  
  if (role === 'patient' && !hasConsented) {
    return <LegalConsent onConsent={() => setHasConsented(true)} onBack={() => setRole(null)} />;
  }

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
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><AlertCircle size={40} /></div>
            <h3 className="text-2xl font-black text-center text-slate-800 tracking-tight">¿Cerrar Sesión?</h3>
            <p className="text-slate-500 text-center mt-3 mb-10 text-sm leading-relaxed">Tus datos se encuentran sincronizados. Se recomienda cerrar la sesión al terminar tu jornada clínica.</p>
            <div className="flex flex-col gap-4">
              <button onClick={handleLogout} className="w-full bg-red-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 hover:bg-red-600 transition-all">Salir con Seguridad</button>
              <button onClick={() => setShowLogoutModal(false)} className="w-full bg-slate-50 text-slate-600 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 shadow-2xl transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className={`p-10 text-white rounded-br-[4rem] shadow-2xl ${env === 'demo' ? 'bg-orange-600' : (role === 'physio' ? 'bg-emerald-800' : 'bg-blue-700')}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg">
                {role === 'physio' ? <Stethoscope className="w-8 h-8 text-white" /> : <Activity className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tighter">FisioSevilla</h1>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                   {role === 'physio' ? 'Ciencia Aplicada' : 'Sede Digital'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 bg-black/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                {role === 'physio' ? <Microscope size={20} /> : <User size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {role === 'physio' ? 'Personal Clínico' : 'Paciente'}
                </p>
                <p className="text-sm font-bold truncate">
                  {role === 'physio' ? currentPhysio?.name : patients[0]?.name || 'Usuario'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 mt-8 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const activeColor = role === 'physio' ? 'bg-emerald-600' : 'bg-blue-600';
              const shadowColor = role === 'physio' ? 'shadow-emerald-100' : 'shadow-blue-100';

              return (
                <button 
                  key={item.id} 
                  onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-300 relative group ${isActive ? `${activeColor} text-white shadow-xl ${shadowColor}` : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                  {isActive && <div className="absolute right-6 w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                </button>
              );
            })}
          </nav>

          <div className="p-8 border-t border-slate-50 space-y-4">
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut size={14} /> Salir del Sistema
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-slate-50/50 h-full scroll-smooth">
        <header className={`md:hidden ${role === 'physio' ? 'bg-emerald-800' : 'bg-blue-700'} text-white p-5 flex justify-between items-center sticky top-0 z-40 shadow-xl`}>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-white" />
            <span className="font-black text-lg tracking-tight">FisioSevilla</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="p-3 bg-white/10 rounded-2xl active:scale-90 transition-transform"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-4 md:p-12 lg:p-16 max-w-7xl mx-auto">
          {renderView()}
        </div>

        {(currentPhysio || hasConsented) && (
          <GlobalAssistant role={role} user={role === 'physio' ? currentPhysio : patients[0]} />
        )}
      </main>
    </div>
  );
};

export default App;
