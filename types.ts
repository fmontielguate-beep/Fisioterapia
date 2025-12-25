
export type UserRole = 'patient' | 'physio';

export interface PhysioUser {
  id: string;
  name: string;
  professionalId: string; // Nº de Colegiado o DNI
  specialty: string;
  password?: string;
}

export interface VitalSigns {
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  temperature: number;
}

export type DiagnosticType = 'Sanguínea' | 'Radiología' | 'Neuroconducción' | 'Imagen Avanzada' | 'Otros';

export interface DiagnosticStudy {
  id: string;
  type: DiagnosticType;
  title: string;
  date: string;
  resultSummary: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  readTime: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: 'Movilidad' | 'Fuerza' | 'Estiramiento';
  videoUrl?: string;
  reps: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  content: string;
  painLevel: number; // 1-10
  author: string;
  vitalSigns?: VitalSigns; // Captura de constantes en el momento de la nota
  type: 'Evolución' | 'Plan de Trabajo' | 'General';
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  idNumber: string; // DNI
  email: string;
  phone: string;
  condition: string;
  diagnosis: string;
  admissionDate: string; // Fecha de ingreso al programa
  treatmentResponse: string; // Resumen de respuesta al tratamiento
  illnessHistory: string; // Historia detallada del padecimiento
  treatmentReceived: string;
  treatmentReason: string; // Justificación del tratamiento
  warningSigns: string;    // Señales de alarma
  medicalHistory: string;  // Comorbilidades / Otros diagnósticos
  otherTreatments: string; // Medicación y tratamientos externos
  clinicalFindings: string;
  drugInteractions: string; // Posibles interacciones
  referralSource: string;
  patientType: 'Intrahospitalario' | 'Ambulatorio';
  ambulationType: string;
  vitalSigns: VitalSigns;
  diagnosticStudies: DiagnosticStudy[];
  progress: number;
  lastSession: string;
  notes: ClinicalNote[];
  assignedExercises: Exercise[];
}

export interface Message {
  id: string;
  sender: 'user' | 'physio' | 'ai';
  text: string;
  timestamp: Date;
}

export interface JointAngles {
  shoulder: number;
  elbow: number;
  hip: number;
  knee: number;
}

export interface PREMResult {
  date: string;
  score: number;
  comment: string;
}
