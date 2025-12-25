
// Version constant for the application
export const APP_VERSION = "v2.5.8 PRO";

export type UserRole = 'patient' | 'physio';

export interface PhysioUser {
  id: string;
  name: string;
  professionalId: string; // Nº de Colegiado o DNI
  specialty: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface VitalSigns {
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  temperature: number;
  weight: number; // kg
  height: number; // cm
  bmi: number;
}

export interface GoniometryRecord {
  joint: string;
  movement: string;
  activeRange: string;
  passiveRange: string;
}

export interface OrthopedicTestResult {
  id: string;
  category: string;
  testName: string;
  result: 'Positivo' | 'Negativo' | 'Dudoso';
  observations: string;
}

export interface PhysicalExamination {
  visualInspection: string;
  palpation: string;
  goniometry: GoniometryRecord[];
  orthopedicTests: OrthopedicTestResult[];
}

export type DiagnosticType = 'Sanguínea' | 'Radiología' | 'Neuroconducción' | 'Imagen Avanzada' | 'Otros';

export interface DiagnosticStudy {
  id: string;
  type: DiagnosticType;
  title: string;
  date: string;
  resultSummary: string;
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
  vitalSigns?: VitalSigns; 
  physicalExam?: PhysicalExamination;
  type: 'Evolución' | 'Plan de Trabajo' | 'General';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Tratamiento' | 'Revisión' | 'Evaluación' | 'Domicilio';
}

export type ActivityLevel = 'Sedentario' | 'Leve' | 'Moderado' | 'Activo' | 'Deportista Competición' | 'Atleta Alto Rendimiento';

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  idNumber: string; 
  email: string;
  phone: string;
  condition: string;
  diagnosis: string;
  admissionDate: string; 
  treatmentResponse: string; 
  illnessHistory: string; 
  treatmentReceived: string;
  treatmentReason: string; 
  warningSigns: string;    // Signos de Alarma / Red Flags
  medicalHistory: string;  // Antecedentes Médicos
  allergies: string;       // Alergias
  otherTreatments: string; // Medicamentos actuales
  clinicalFindings: string;
  physicalActivityLevel: ActivityLevel;
  physicalExam: PhysicalExamination; 
  drugInteractions: string; // Alertas sobre medicamentos
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

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  readTime: string;
}

export interface JointAngles {
  shoulder: number;
  elbow: number;
  hip: number;
  knee: number;
}
