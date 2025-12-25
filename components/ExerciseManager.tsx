
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Save, Trash2, Edit3, CheckCircle2, User, Book, ArrowLeft, X, Activity } from 'lucide-react';
import { Exercise, PatientInfo } from '../types';

interface ExerciseManagerProps {
  patients: PatientInfo[];
  initialSelectedPatient: PatientInfo | null;
  onUpdatePlan: (patientId: string, exercises: Exercise[]) => void;
  onBack?: () => void;
}

const ExerciseManager: React.FC<ExerciseManagerProps> = ({ patients, initialSelectedPatient, onUpdatePlan, onBack }) => {
  const [showCreator, setShowCreator] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialSelectedPatient?.id || '');
  const [assignedExercises, setAssignedExercises] = useState<Exercise[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [library, setLibrary] = useState<Exercise[]>([
    { id: '1', title: 'Sentadilla en Pared', description: 'Mantén la espalda apoyada y baja lentamente.', category: 'Fuerza', reps: '3 series de 10 reps' },
    { id: '2', title: 'Puente de Glúteo', description: 'Eleva la cadera manteniendo el core firme.', category: 'Fuerza', reps: '2 series de 15 reps' },
    { id: '3', title: 'Estiramiento Isquiotibial', description: 'Tumbado boca arriba, eleva la pierna con una cincha.', category: 'Estiramiento', reps: '3 series de 30s' },
    { id: '4', title: 'Movilidad de Tobillo', description: 'De pie, lleva la rodilla hacia la pared sin levantar el talón.', category: 'Movilidad', reps: '2 series de 12 reps' },
  ]);

  useEffect(() => {
    const patient = patients.find(p => p.id === selectedPatientId);
    if (patient) {
      setAssignedExercises(patient.assignedExercises || []);
    } else {
      setAssignedExercises([]);
    }
  }, [selectedPatientId, patients]);

  const toggleExercise = (exercise: Exercise) => {
    setAssignedExercises(prev => {
      const exists = prev.find(e => e.id === exercise.id);
      if (exists) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleSavePlan = () => {
    if (!selectedPatientId) return;
    onUpdatePlan(selectedPatientId, assignedExercises);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Nuevo Header con botón Volver */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-lg p-4 rounded-3xl border border-white/40 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-wider group">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>Volver</span>
            </button>
          )}
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Plan de Trabajo</h2>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">Diseño de Terapia</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreator(!showCreator)}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors shadow-lg ${
            showCreator ? 'bg-slate-200 text-slate-600 shadow-slate-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
          }`}
        >
          {showCreator ? <><X className="w-5 h-5" /> Cancelar</> : <><PlusCircle className="w-5 h-5" /> Crear Ejercicio</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:flex md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Biblioteca y Planes</h2>
          <p className="text-slate-500 font-medium">Configura el tratamiento personalizado para tus pacientes.</p>
        </div>
      </div>

      {showCreator && (
        <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-xl animate-in slide-in-from-top duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Edit3 className="text-blue-500 w-5 h-5" /> Definir Nuevo Ejercicio en Biblioteca
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Nombre</label>
              <input type="text" placeholder="Ej: Extensión de rodilla" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Categoría</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Fuerza</option>
                <option>Movilidad</option>
                <option>Estiramiento</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Instrucciones</label>
              <textarea rows={2} placeholder="Cómo realizarlo correctamente..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setShowCreator(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400">Descartar</button>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Guardar en Biblioteca</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biblioteca de Ejercicios */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-600" /> Biblioteca Global
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border border-slate-100 rounded-full text-xs w-32 focus:w-48 transition-all focus:ring-1 focus:ring-blue-300 outline-none" />
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {library.map((ex) => {
              const isAssigned = assignedExercises.find(ae => ae.id === ex.id);
              return (
                <div 
                  key={ex.id} 
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isAssigned ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                  onClick={() => toggleExercise(ex)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAssigned ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                      {isAssigned ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isAssigned ? 'text-blue-900' : 'text-slate-700'}`}>{ex.title}</h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{ex.category} • {ex.reps}</p>
                    </div>
                  </div>
                  <button className={`p-2 rounded-lg transition-colors ${isAssigned ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-300 group-hover:bg-white group-hover:text-blue-500'}`}>
                    {isAssigned ? <Trash2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Asignación a Paciente */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" /> Plan Personalizado
            </h3>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Paciente Destinatario</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="" disabled>Seleccionar Paciente...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.idNumber})</option>
                ))}
              </select>
            </div>

            <div className="flex-1 bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-100 flex flex-col">
              {!selectedPatientId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                  <User className="w-12 h-12" />
                  <p className="text-sm font-medium">Elige un paciente para empezar</p>
                </div>
              ) : assignedExercises.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                  <Book className="w-12 h-12" />
                  <p className="text-sm font-medium">No hay ejercicios seleccionados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Ejercicios en el plan de {selectedPatient?.name.split(' ')[0]}:</p>
                  {assignedExercises.map(ex => (
                    <div key={ex.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-bold text-slate-700">{ex.title}</span>
                      </div>
                      <button 
                        onClick={() => toggleExercise(ex)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              disabled={!selectedPatientId}
              onClick={handleSavePlan}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                saveSuccess 
                  ? 'bg-green-500 text-white shadow-green-100' 
                  : !selectedPatientId 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
              }`}
            >
              {saveSuccess ? (
                <><CheckCircle2 className="w-5 h-5" /> Plan Guardado Correctamente</>
              ) : (
                <><Save className="w-5 h-5" /> Actualizar Plan de Tratamiento</>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExerciseManager;
