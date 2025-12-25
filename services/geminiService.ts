
import { GoogleGenAI, Type } from "@google/genai";
import { JointAngles, PatientInfo } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPhysioFeedback = async (angles: JointAngles, exerciseName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un fisioterapeuta experto en Sevilla. El paciente está realizando el ejercicio: "${exerciseName}".
      Los ángulos capturados de sus articulaciones son:
      - Hombro: ${angles.shoulder} grados
      - Codo: ${angles.elbow} grados
      - Cadera: ${angles.hip} grados
      - Rodilla: ${angles.knee} grados
      
      Proporciona un feedback breve, motivador y en lenguaje sencillo (sin jerga técnica). 
      Dile si la postura es correcta o qué debe ajustar (ej. "baja un poco más la cadera" o "mantén la espalda recta").
      Usa un tono cercano y profesional.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Lo estás haciendo bien, sigue así.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No he podido analizar tu postura ahora mismo, pero mantén el control del movimiento.";
  }
};

export const getAssistantResponse = async (userMessage: string, patient: PatientInfo): Promise<string> => {
  try {
    const exercisesText = patient.assignedExercises.map(e => `- ${e.title}: ${e.description} (${e.reps})`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres el Asistente IA de FisioSevilla. Estás ayudando a ${patient.name}.
      
      Datos del paciente:
      - Progreso actual: ${patient.progress}% de la recuperación completado.
      - Condición: ${patient.condition}.
      - Diagnóstico: ${patient.diagnosis}.
      - Ejercicios asignados:
      ${exercisesText}
      
      Responde a la siguiente duda del paciente de forma amable, clara y motivadora. 
      Si pregunta por sus ejercicios, explícaselos con sencillez. 
      Si pregunta por su progreso, anímale basándote en su ${patient.progress}%.
      No des diagnósticos médicos nuevos, cíñete a su plan de tratamiento actual.
      Si la duda es muy técnica o indica mucho dolor, recomiéndale hablar directamente con su fisioterapeuta mediante el chat profesional.
      
      Mensaje del paciente: "${userMessage}"`,
      config: {
        temperature: 0.8,
      },
    });

    return response.text || "Lo siento, no he podido procesar tu consulta. Inténtalo de nuevo o contacta con tu fisioterapeuta.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "En este momento no puedo responder, pero recuerda seguir las indicaciones de tu fisioterapeuta.";
  }
};

export const getGlobalAIResponse = async (message: string, role: 'patient' | 'physio', context?: any): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  let systemInstruction = "";

  if (role === 'physio') {
    systemInstruction = `Eres un Asistente Clínico IA experto para Fisioterapeutas en Sevilla.
    Tu objetivo es ayudar al profesional con:
    1. Razonamiento clínico basado en la evidencia (EBP).
    2. Sugerencias de progresión de ejercicios.
    3. Resumen de patologías o técnicas de terapia manual.
    4. Redacción de notas clínicas profesionales.
    Mantén un tono técnico, preciso y profesional. Si te preguntan por un paciente específico, usa los datos proporcionados.
    Evita dar consejos médicos finales, siempre indica que la decisión es del facultativo.`;
  } else {
    systemInstruction = `Eres el Asistente de Recuperación de FisioSevilla. Estás hablando con un paciente.
    Tu objetivo es:
    1. Resolver dudas sobre cómo hacer los ejercicios asignados.
    2. Motivar al paciente en su proceso.
    3. Dar consejos generales de salud y bienestar relacionados con la fisioterapia.
    Sé amable, empático y usa un lenguaje sencillo. Si el paciente reporta mucho dolor (Red Flag), indícale que pare y avise a su fisioterapeuta de inmediato.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "No he podido procesar la consulta.";
  } catch (error) {
    return "Hubo un error al conectar con el servidor de IA.";
  }
};
