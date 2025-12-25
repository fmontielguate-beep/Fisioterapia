
import React, { useState, useEffect } from 'react';
import { 
  Save, ArrowLeft, User, Heart, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { PatientInfo, ActivityLevel } from '../types';

interface NewPatientFormProps {
  initialPatient?: PatientInfo;
  onSave: (patient: PatientInfo) => void;
  onCancel: () => void;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ initialPatient, onSave, onCancel }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: initialPatient?.name || '', 
    idNumber: initialPatient?.idNumber || '', 
    age: initialPatient?.age.toString() || '', 
    email: initialPatient?.email || '', 
    phone: initialPatient?.phone || '', 
    condition: initialPatient?.condition || '', 
    diagnosis: initialPatient?.diagnosis || '', 
    admissionDate: initialPatient?.admissionDate || new Date().toISOString().split('T')[0],
    illnessHistory: initialPatient?.illnessHistory || '', 
    physicalActivityLevel: initialPatient?.physicalActivityLevel || 'Sedentario' as ActivityLevel, 
    patientType: initialPatient?.patientType || 'Ambulatorio' as any,
    medicalHistory: initialPatient?.medicalHistory || '', 
    allergies: initialPatient?.allergies || '', 
    otherTreatments: initialPatient?.otherTreatments || '', 
    warningSigns: initialPatient?.warningSigns || '', 
    drugInteractions: initialPatient?.drugInteractions || '',
    hr: initialPatient?.vitalSigns.heartRate.toString() || '72', 
    rr: initialPatient?.vitalSigns.respiratoryRate.toString() || '16', 
    bp: initialPatient?.vitalSigns.bloodPressure || '120/80', 
    spo2: initialPatient?.vitalSigns.oxygenSaturation.toString() || '98', 
    temp: initialPatient?.vitalSigns.temperature.toString() || '36.5', 
    weight: initialPatient?.vitalSigns.weight.toString() || '75', 
    height: initialPatient?.vitalSigns.height.toString() || '175', 
    bmi: initialPatient?.vitalSigns.bmi.toString() || '24.5',
    visualInspection: initialPatient?.physicalExam.visualInspection || '', 
    palpation: initialPatient?.physicalExam.palpation || ''
  });

  useEffect(() => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height) / 100;
    if (w > 0 && h > 0) {
      const calculated = (w / (h * h)).toFixed(2);
      setFormData(prev => ({ ...prev, bmi: calculated }));
    }
  }, [formData.weight, formData.height]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: PatientInfo = {
      id: initialPatient?.id || Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age) || 0,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      condition: formData.condition,
      diagnosis: formData.diagnosis,
      admissionDate: formData.admissionDate,
      treatmentResponse: initialPatient?.treatmentResponse || 'Pendiente de evaluación.',
      illnessHistory: formData.illnessHistory,
      treatmentReceived: initialPatient?.treatmentReceived || '',
      treatmentReason: initialPatient?.treatmentReason || '',
      warningSigns: formData.warningSigns,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      otherTreatments: formData.otherTreatments,
      drugInteractions: formData.drugInteractions,
      clinicalFindings: initialPatient?.clinicalFindings || '',
      physicalActivityLevel: formData.physicalActivityLevel,
      physicalExam: { 
        visualInspection: formData.visualInspection, 
        palpation: formData.palpation, 
        goniometry: initialPatient?.physicalExam.goniometry || [], 
        orthopedicTests: initialPatient?.physicalExam.orthopedicTests || [] 
      },
      referralSource: initialPatient?.referralSource || '', 
      patientType: formData.patientType,
      ambulationType: initialPatient?.ambulationType || 'Independiente',
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
      diagnosticStudies: initialPatient?.diagnosticStudies || [], 
      progress: initialPatient?.progress || 0, 
      lastSession: initialPatient?.lastSession || 'Ingreso', 
      notes: initialPatient?.notes || [], 
      assignedExercises: initialPatient?.assignedExercises || []
    };
    onSave(patient);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 max-w-4xl mx-auto">
      <header className="flex justify-between items-center bg-white/70 backdrop-blur-lg p-6 rounded-[2.5rem] border border-white/40 sticky top-0 z-30 shadow-lg">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
           <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><ArrowLeft size={16} /></div>
           <span>Cancelar</span>
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{initialPatient ? 'Modo Edición' : 'Alta de Paciente'}</h2>
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{initialPatient ? initialPatient.name : 'Nueva Ficha Clínica'}</p>
        </div>
        <button type="button" onClick={handleSubmit} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center gap-2 hover:bg-emerald-700 transition-all">
          <Save size={16} /> {initialPatient ? 'Actualizar' : 'Finalizar'}
        </button>
      </header>

      <div className="flex gap-2 justify-center">
         {[1, 2, 3].map(s => <div key={s} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStep === s ? 'bg-emerald-600 w-12' : 'bg-slate-200'}`}></div>)}
      </div>

      <main>
        {activeStep === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><User className="text-emerald-500" /> Datos Principales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Nombre Completo" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} required />
                <FormInput label="DNI / Pasaporte" value={formData.idNumber} onChange={(v: string) => setFormData({...formData, idNumber: v})} required />
                <FormInput label="Edad" value={formData.age} onChange={(v: string) => setFormData({...formData, age: v})} type="number" />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel Actividad</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-black text-xs outline-none" value={formData.physicalActivityLevel} onChange={e => setFormData({...formData, physicalActivityLevel: e.target.value as ActivityLevel})}>
                    <option value="Sedentario">Sedentario</option>
                    <option value="Leve">Leve</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Activo">Activo</option>
                  </select>
                </div>
              </div>
              <FormTextArea label="Diagnóstico Médico / Juicio Clínico" value={formData.diagnosis} onChange={(v: string) => setFormData({...formData, diagnosis: v})} rows={3} />
            </section>
            <button onClick={() => setActiveStep(2)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Continuar a Antecedentes</button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-8 animate-in fade-in">
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><ShieldAlert className="text-amber-500" /> Historia y Seguridad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormTextArea label="Antecedentes Médicos" value={formData.medicalHistory} onChange={(v: string) => setFormData({...formData, medicalHistory: v})} />
                <FormTextArea label="Alergias Conocidas" value={formData.allergies} onChange={(v: string) => setFormData({...formData, allergies: v})} />
                <FormTextArea label="Tratamientos Farmacológicos" value={formData.otherTreatments} onChange={(v: string) => setFormData({...formData, otherTreatments: v})} />
                <FormTextArea label="Alertas Medicación" value={formData.drugInteractions} onChange={(v: string) => setFormData({...formData, drugInteractions: v})} />
              </div>
              <FormTextArea label="Signos de Alarma (Red Flags)" value={formData.warningSigns} onChange={(v: string) => setFormData({...formData, warningSigns: v})} color="red" />
            </section>
            <div className="flex gap-4">
              <button onClick={() => setActiveStep(1)} className="flex-1 bg-white border border-slate-200 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs">Atrás</button>
              <button onClick={() => setActiveStep(3)} className="flex-[3] bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Finalizar con Biometría</button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-8 animate-in fade-in">
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><Heart className="text-red-500" /> Triaje Bio-médico</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <FormInput label="FC (lpm)" value={formData.hr} onChange={(v: string) => setFormData({...formData, hr: v})} type="number" />
                <FormInput label="TA (mmHg)" value={formData.bp} onChange={(v: string) => setFormData({...formData, bp: v})} />
                <FormInput label="Peso (kg)" value={formData.weight} onChange={(v: string) => setFormData({...formData, weight: v})} type="number" />
                <FormInput label="Talla (cm)" value={formData.height} onChange={(v: string) => setFormData({...formData, height: v})} type="number" />
              </div>
              <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 text-center">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">IMC Calculado</p>
                 <p className="text-3xl font-black text-indigo-700">{formData.bmi}</p>
              </div>
            </section>
            <div className="flex gap-4">
              <button onClick={() => setActiveStep(2)} className="flex-1 bg-white border border-slate-200 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs">Atrás</button>
              <button onClick={handleSubmit} className="flex-[3] bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Guardar Cambios en Ficha</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const FormInput = ({ label, value, onChange, placeholder, type = 'text', required = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
  </div>
);

const FormTextArea = ({ label, value, onChange, placeholder, rows = 3, color = 'emerald' }: any) => (
  <div className="space-y-2">
    <label className={`text-[10px] font-black ${color === 'red' ? 'text-red-500' : 'text-slate-400'} uppercase tracking-widest ml-1`}>{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`w-full px-5 py-4 rounded-2xl border ${color === 'red' ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-slate-50'} focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700 transition-all`} />
  </div>
);

export default NewPatientForm;
