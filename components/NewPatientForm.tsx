
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Save, ArrowLeft, User, Heart, Plus, Trash2, CheckCircle2, 
  Stethoscope, Compass, FlaskConical, TrendingUp, Scale, Ruler, Zap as BMI
} from 'lucide-react';
import { PatientInfo, GoniometryRecord, OrthopedicTestResult, ActivityLevel } from '../types';

interface NewPatientFormProps {
  onSave: (patient: PatientInfo) => void;
  onCancel: () => void;
}

const ORTHOPEDIC_DICTIONARY: Record<string, string[]> = {
  'Hombro': ['Test de Neer', 'Test de Hawkins-Kennedy', 'Signo de Jobe (Empty Can)', 'Test de Speed', 'Test de Yergason', 'Apprehension Test'],
  'Rodilla': ['Test de Lachman', 'Cajón Anterior/Posterior', 'Test de McMurray', 'Test de Appley', 'Pivot Shift', 'Prueba de Zohlen'],
  'Cadera': ['Test de FABER', 'Test de Thomas', 'Signo de Trendelenburg', 'Test de FADIR'],
  'Columna Cervical': ['Test de Spurling', 'Test de Distracción', 'Prueba de Valsalva'],
  'Columna Lumbar': ['Test de Lasegue (SLR)', 'Test de Bragard', 'Slump Test', 'Test de Schober'],
  'Tobillo/Pie': ['Cajón Anterior Tobillo', 'Prueba de Thompson', 'Signo de Mulder']
};

const NewPatientForm: React.FC<NewPatientFormProps> = ({ onSave, onCancel }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', idNumber: '', age: '', email: '', phone: '', condition: '', diagnosis: '', admissionDate: new Date().toISOString().split('T')[0],
    illnessHistory: '', physicalActivityLevel: 'Sedentario' as ActivityLevel, patientType: 'Ambulatorio' as any,
    hr: '72', rr: '16', bp: '120/80', spo2: '98', temp: '36.5', weight: '75', height: '175', bmi: '24.5',
    visualInspection: '', palpation: ''
  });

  const [goniometry, setGoniometry] = useState<GoniometryRecord[]>([]);
  const [orthopedicTests, setOrthopedicTests] = useState<OrthopedicTestResult[]>([]);
  const [newGonio, setNewGonio] = useState({ joint: '', movement: '', activeRange: '', passiveRange: '' });
  const [selectedCategory, setSelectedCategory] = useState('Hombro');

  // Calcular IMC automáticamente al cambiar peso o talla
  useEffect(() => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height) / 100;
    if (w > 0 && h > 0) {
      const calculated = (w / (h * h)).toFixed(2);
      setFormData(prev => ({ ...prev, bmi: calculated }));
    }
  }, [formData.weight, formData.height]);

  const addGonio = () => {
    if (!newGonio.joint || !newGonio.movement) return;
    setGoniometry([...goniometry, { ...newGonio }]);
    setNewGonio({ joint: '', movement: '', activeRange: '', passiveRange: '' });
  };

  const addOrthopedicTest = (testName: string) => {
    setOrthopedicTests([...orthopedicTests, {
      id: Date.now().toString(),
      category: selectedCategory,
      testName,
      result: 'Negativo',
      observations: ''
    }]);
  };

  const updateTest = (id: string, field: string, value: string) => {
    setOrthopedicTests(orthopedicTests.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: PatientInfo = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age) || 0,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      condition: formData.condition,
      diagnosis: formData.diagnosis,
      admissionDate: formData.admissionDate,
      treatmentResponse: 'Pendiente de evaluación inicial.',
      illnessHistory: formData.illnessHistory,
      treatmentReceived: '',
      treatmentReason: '',
      warningSigns: '',
      medicalHistory: '',
      otherTreatments: '',
      clinicalFindings: '',
      physicalActivityLevel: formData.physicalActivityLevel,
      physicalExam: {
        visualInspection: formData.visualInspection,
        palpation: formData.palpation,
        goniometry,
        orthopedicTests
      },
      drugInteractions: '',
      referralSource: '',
      patientType: formData.patientType,
      ambulationType: 'Independiente',
      vitalSigns: { 
        heartRate: parseInt(formData.hr), 
        respiratoryRate: parseInt(formData.rr),
        bloodPressure: formData.bp, 
        oxygenSaturation: parseInt(formData.spo2), 
        temperature: parseFloat(formData.temp),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        bmi: parseFloat(formData.bmi)
      },
      diagnosticStudies: [],
      progress: 0,
      lastSession: 'Ingreso',
      notes: [],
      assignedExercises: []
    };
    onSave(newPatient);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
      <header className="flex justify-between items-center bg-white/70 backdrop-blur-lg p-6 rounded-[2.5rem] border border-white/40 sticky top-0 z-30 shadow-lg">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
           <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><ArrowLeft size={16} /></div>
           <span>Descartar</span>
        </button>
        <div className="flex gap-2">
           {[1, 2, 3].map(s => <div key={s} className={`w-3 h-3 rounded-full ${activeStep === s ? 'bg-blue-600 w-8' : 'bg-slate-200'}`}></div>)}
        </div>
        <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center gap-2 hover:bg-blue-700">
          <Save size={16} /> Finalizar Registro
        </button>
      </header>

      {activeStep === 1 && (
        <div className="space-y-8 animate-in slide-in-from-right">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><User className="text-blue-500" /> Datos Generales y Actividad</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput label="Nombre Completo" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} required />
              <FormInput label="DNI" value={formData.idNumber} onChange={(v: string) => setFormData({...formData, idNumber: v})} required />
              <FormInput label="Edad" value={formData.age} onChange={(v: string) => setFormData({...formData, age: v})} type="number" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nivel de Actividad Física Usual</label>
              <div className="grid grid-cols-5 gap-2">
                {(['Sedentario', 'Leve', 'Moderado', 'Activo', 'Muy Activo'] as ActivityLevel[]).map(level => (
                  <button 
                    key={level} type="button" 
                    onClick={() => setFormData({...formData, physicalActivityLevel: level})}
                    className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.physicalActivityLevel === level ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <FormTextArea label="Historia Clínica Breve" value={formData.illnessHistory} onChange={(v: string) => setFormData({...formData, illnessHistory: v})} rows={4} />
          </section>
          <button onClick={() => setActiveStep(2)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl">Siguiente: Constantes Vitales</button>
        </div>
      )}

      {activeStep === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><Heart className="text-red-500" /> Constantes y Biometría</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormInput label="FC (lpm)" value={formData.hr} onChange={(v: string) => setFormData({...formData, hr: v})} type="number" />
              <FormInput label="FR (rpm)" value={formData.rr} onChange={(v: string) => setFormData({...formData, rr: v})} type="number" />
              <FormInput label="Tensión (TA)" value={formData.bp} onChange={(v: string) => setFormData({...formData, bp: v})} placeholder="120/80" />
              <FormInput label="SatO2 (%)" value={formData.spo2} onChange={(v: string) => setFormData({...formData, spo2: v})} type="number" />
              <FormInput label="Temp (ºC)" value={formData.temp} onChange={(v: string) => setFormData({...formData, temp: v})} type="number" step="0.1" />
              <FormInput icon={<Scale size={14} />} label="Peso (kg)" value={formData.weight} onChange={(v: string) => setFormData({...formData, weight: v})} type="number" step="0.1" />
              <FormInput icon={<Ruler size={14} />} label="Talla (cm)" value={formData.height} onChange={(v: string) => setFormData({...formData, height: v})} type="number" />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><BMI size={12}/> IMC (Auto)</label>
                <div className="px-5 py-3 rounded-2xl bg-indigo-50 border border-indigo-100 font-black text-indigo-700 text-center text-lg">{formData.bmi}</div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormTextArea label="Inspección Visual (Hallazgos iniciales)" value={formData.visualInspection} onChange={(v: string) => setFormData({...formData, visualInspection: v})} placeholder="Postura, edema, trofismo..." rows={3} />
              <FormTextArea label="Palpación (Puntos dolorosos, tono)" value={formData.palpation} onChange={(v: string) => setFormData({...formData, palpation: v})} placeholder="Calor, hipotonía, contracturas..." rows={3} />
            </div>
          </section>
          <div className="flex gap-4">
            <button onClick={() => setActiveStep(1)} className="flex-1 bg-white border border-slate-200 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs">Atrás</button>
            <button onClick={() => setActiveStep(3)} className="flex-[3] bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em]">Siguiente: Pruebas Funcionales</button>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><FlaskConical className="text-blue-500" /> Pruebas y Test Ortopédicos</h3>
            <div className="space-y-4">
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {Object.keys(ORTHOPEDIC_DICTIONARY).map(cat => (
                    <button 
                      key={cat} type="button" 
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ORTHOPEDIC_DICTIONARY[selectedCategory].map(test => (
                    <button 
                      key={test} type="button" onClick={() => addOrthopedicTest(test)}
                      className="p-3 text-left bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 hover:border-blue-400"
                    >
                      + {test}
                    </button>
                  ))}
               </div>
            </div>

            {orthopedicTests.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {orthopedicTests.map((t) => (
                   <div key={t.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-3">
                      <div className="flex justify-between font-black text-[9px] text-slate-400 uppercase"><span>{t.category}</span><button onClick={() => setOrthopedicTests(orthopedicTests.filter(ot => ot.id !== t.id))} className="text-red-400"><Trash2 size={12}/></button></div>
                      <h5 className="font-bold text-slate-800 text-sm">{t.testName}</h5>
                      <div className="flex gap-2">
                        {(['Negativo', 'Dudoso', 'Positivo'] as any[]).map(res => (
                          <button 
                            key={res} type="button" 
                            onClick={() => updateTest(t.id, 'result', res)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase ${t.result === res ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                      <input type="text" placeholder="Notas..." className="w-full px-4 py-2 text-xs rounded-xl outline-none" value={t.observations} onChange={e => updateTest(t.id, 'observations', e.target.value)} />
                   </div>
                 ))}
              </div>
            )}
          </section>
          <div className="flex gap-4">
            <button onClick={() => setActiveStep(2)} className="flex-1 bg-white border border-slate-200 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs">Atrás</button>
            <button onClick={handleSubmit} className="flex-[3] bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
               <CheckCircle2 size={18} /> Confirmar Alta de Paciente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, value, onChange, placeholder, type = 'text', required = false, icon = null }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">{icon}{label} {required && '*'}</label>
    <input 
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
    />
  </div>
);

const FormTextArea = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-slate-700 transition-all"
    />
  </div>
);

export default NewPatientForm;
