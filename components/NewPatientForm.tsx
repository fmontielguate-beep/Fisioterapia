
import React, { useState } from 'react';
import { 
  UserPlus, 
  Save, 
  Home, 
  X, 
  Stethoscope, 
  ShieldAlert, 
  Info,
  ArrowLeft,
  FileText,
  User,
  Heart,
  Plus,
  Trash2,
  BookOpen,
  ClipboardList,
  Pill,
  GraduationCap
} from 'lucide-react';
import { PatientInfo, DiagnosticStudy, DiagnosticType } from '../types';

interface NewPatientFormProps {
  onSave: (patient: PatientInfo) => void;
  onCancel: () => void;
}

const FormInput = ({ label, value, onChange, placeholder, type = 'text', required = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      required={required}
      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-slate-700 transition-all"
    />
  </div>
);

const FormTextArea = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      rows={rows}
      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-slate-700 transition-all"
    />
  </div>
);

const NewPatientForm: React.FC<NewPatientFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    age: '',
    email: '',
    phone: '',
    condition: '',
    diagnosis: '',
    illnessHistory: '',
    treatmentReceived: '',
    treatmentReason: '',
    warningSigns: '',
    medicalHistory: '',
    otherTreatments: '',
    clinicalFindings: '',
    drugInteractions: '',
    referralSource: '',
    patientType: 'Ambulatorio' as 'Ambulatorio' | 'Intrahospitalario',
    ambulationType: 'Independiente',
    progress: '0',
    hr: '70',
    bp: '120/80',
    spo2: '98',
    temp: '36.5'
  });

  const [studies] = useState<DiagnosticStudy[]>([]);

  const handleScholarSearch = () => {
    const term = formData.diagnosis || formData.condition;
    if (!term) return;
    const query = encodeURIComponent(`fisioterapia evidencia "${term}"`);
    window.open(`https://scholar.google.es/scholar?q=${query}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.idNumber) return;

    const newPatient: PatientInfo = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age) || 0,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      condition: formData.condition,
      diagnosis: formData.diagnosis,
      illnessHistory: formData.illnessHistory,
      treatmentReceived: formData.treatmentReceived,
      treatmentReason: formData.treatmentReason,
      warningSigns: formData.warningSigns,
      medicalHistory: formData.medicalHistory,
      otherTreatments: formData.otherTreatments,
      clinicalFindings: formData.clinicalFindings,
      drugInteractions: formData.drugInteractions,
      referralSource: formData.referralSource,
      patientType: formData.patientType,
      ambulationType: formData.ambulationType,
      vitalSigns: {
        heartRate: parseInt(formData.hr),
        bloodPressure: formData.bp,
        oxygenSaturation: parseInt(formData.spo2),
        temperature: parseFloat(formData.temp)
      },
      diagnosticStudies: studies,
      progress: parseInt(formData.progress) || 0,
      lastSession: 'Ingreso inicial',
      notes: [],
      assignedExercises: []
    };

    onSave(newPatient);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
      <header className="flex justify-between items-center bg-white/70 backdrop-blur-lg p-4 rounded-3xl border border-white/40 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
             <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-red-50 transition-colors border border-slate-100"><ArrowLeft className="w-4 h-4" /></div>
            <span>Descartar</span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
             <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-50 transition-colors border border-slate-100"><Home className="w-4 h-4" /></div>
            <span>Inicio</span>
          </button>
        </div>
        <h2 className="hidden md:block text-xl font-black text-slate-800">Alta de Paciente</h2>
        <button type="submit" form="patient-form" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100"><Save size={18} /> <span>Guardar HCE</span></button>
      </header>

      <form id="patient-form" onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Identificación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Nombre Completo" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} required />
            <FormInput label="DNI / Pasaporte" value={formData.idNumber} onChange={(v: string) => setFormData({...formData, idNumber: v})} required />
            <FormInput label="Edad" value={formData.age} onChange={(v: string) => setFormData({...formData, age: v})} type="number" required />
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6 border-l-8 border-l-amber-500">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-amber-600" /> Antecedentes Médicos y Farmacológicos</h3>
          <div className="grid grid-cols-1 gap-6">
            <FormTextArea label="Otros Diagnósticos / Comorbilidades" value={formData.medicalHistory} onChange={(v: string) => setFormData({...formData, medicalHistory: v})} placeholder="Ej: Hipertensión, Diabetes, Escoliosis previa..." rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextArea label="Tratamientos / Medicación Actual" value={formData.otherTreatments} onChange={(v: string) => setFormData({...formData, otherTreatments: v})} placeholder="Listado de fármacos y dosis..." rows={3} />
              <FormTextArea label="Riesgos / Posibles Interacciones" value={formData.drugInteractions} onChange={(v: string) => setFormData({...formData, drugInteractions: v})} placeholder="Contraindicaciones por medicación o patología de base..." rows={3} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6 border-l-8 border-l-blue-600">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Historia del Padecimiento</h3>
            <button 
              type="button" 
              onClick={handleScholarSearch}
              disabled={!formData.diagnosis && !formData.condition}
              className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline disabled:opacity-30"
            >
              <GraduationCap size={14} /> Consultar Evidencia
            </button>
          </div>
          <FormTextArea label="Descripción del Padecimiento Actual" value={formData.illnessHistory} onChange={(v: string) => setFormData({...formData, illnessHistory: v})} rows={4} />
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-blue-500" /> Diagnóstico Fisio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormTextArea label="Diagnóstico Médico Principal" value={formData.diagnosis} onChange={(v: string) => setFormData({...formData, diagnosis: v})} />
            <FormTextArea label="Hallazgos Exploración" value={formData.clinicalFindings} onChange={(v: string) => setFormData({...formData, clinicalFindings: v})} />
          </div>
        </section>
      </form>
    </div>
  );
};

export default NewPatientForm;
