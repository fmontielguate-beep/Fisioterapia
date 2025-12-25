
import { GoogleGenAI, Type } from "@google/genai";
import { JointAngles, PatientInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPhysioFeedback = async (angles: JointAngles, exerciseName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un fisioterapeuta experto. Feedback para "${exerciseName}". Ángulos: Hombro ${angles.shoulder}, Codo ${angles.elbow}, Cadera ${angles.hip}, Rodilla ${angles.knee}. Breve y motivador.`,
      config: { temperature: 0.7 },
    });
    return response.text || "Sigue así.";
  } catch (error) {
    return "Mantén el control del movimiento.";
  }
};

export const getAssistantResponse = async (userMessage: string, patient: PatientInfo): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Asistente de FisioSevilla para ${patient.name}. Progreso: ${patient.progress}%. Condición: ${patient.condition}. Responde a: "${userMessage}" de forma amable y clara.`,
      config: { temperature: 0.8 },
    });
    return response.text || "Lo siento, intenta de nuevo.";
  } catch (error) {
    return "Consulta con tu fisioterapeuta para más detalles.";
  }
};

export const getClinicalAnalysis = async (findings: string, patient: PatientInfo): Promise<string> => {
  try {
    const goniometryStr = patient.physicalExam.goniometry.map(g => `${g.joint} (${g.movement}): A:${g.activeRange}º P:${g.passiveRange}º`).join(', ');
    const testsStr = patient.physicalExam.orthopedicTests.map(t => `${t.testName}: ${t.result}`).join(', ');
    
    const vitals = patient.vitalSigns;
    const vitalsStr = `FC:${vitals.heartRate}lpm, TA:${vitals.bloodPressure}, SatO2:${vitals.oxygenSaturation}%, Peso:${vitals.weight}kg, Talla:${vitals.height}cm, IMC:${vitals.bmi.toFixed(2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Actúa como consultor senior en fisioterapia clínica avanzada (EBP).
      PACIENTE: ${patient.name}, ${patient.age} años.
      DIAGNÓSTICO MÉDICO: ${patient.diagnosis}
      SIGNOS VITALES: ${vitalsStr}
      HISTORIA CLÍNICA: ${patient.illnessHistory}
      ANTECEDENTES Y ALERTAS: ${patient.medicalHistory}. Alergias: ${patient.allergies}. Medicación: ${patient.otherTreatments}.
      EXPLORACIÓN FÍSICA: ${patient.physicalExam.visualInspection}. Goniometría: ${goniometryStr}. Tests: ${testsStr}.
      NUEVOS HALLAZGOS REPORTADOS: ${findings}
      
      TAREA:
      1. Razonamiento Clínico: Conecta los síntomas con la biomecánica y los fármacos.
      2. Diagnóstico Diferencial: Sugiere 3 posibilidades basadas en evidencia.
      3. Plan Terapéutico EBP: Propón fases, terapia manual, ejercicio terapéutico y criterios de progresión.
      Usa Markdown técnico y resolutivo.`,
      config: { 
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    return response.text || "Error en el análisis clínico.";
  } catch (error) {
    return "Error de comunicación con el motor IA.";
  }
};

export const getGlobalAIResponse = async (message: string, role: 'patient' | 'physio', context?: any): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  let systemInstruction = role === 'physio' 
    ? "Eres un Asistente Clínico para Fisioterapeutas. Ayuda con razonamiento clínico EBP y redacción de notas."
    : "Eres el Asistente de Recuperación de FisioSevilla. Sé amable y resuelve dudas de ejercicios.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: { systemInstruction, temperature: 0.7 },
    });
    return response.text || "No puedo procesar la consulta.";
  } catch (error) {
    return "Error de conexión.";
  }
};
