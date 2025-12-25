
import React, { useState } from 'react';
import { Search, Plus, Filter, Play } from 'lucide-react';
import { Exercise } from '../types';

const ExerciseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockExercises: Exercise[] = [
    { id: '1', title: 'Sentadilla en Pared', description: 'Mantén la espalda apoyada y baja lentamente.', category: 'Fuerza', reps: '3 series de 10 reps' },
    { id: '2', title: 'Puente de Glúteo', description: 'Eleva la cadera manteniendo el core firme.', category: 'Fuerza', reps: '2 series de 15 reps' },
    { id: '3', title: 'Estiramiento Isquio', description: 'Estira la pierna suavemente sin forzar.', category: 'Estiramiento', reps: '30 segundos cada pierna' },
    { id: '4', title: 'Movilidad Escapular', description: 'Rota los hombros suavemente hacia atrás.', category: 'Movilidad', reps: '10 rotaciones' },
  ];

  const filtered = mockExercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Biblioteca de Ejercicios</h2>
          <p className="text-slate-500">Consulta tus rutinas personalizadas.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
          <Plus className="w-5 h-5" />
          <span>Subir Propio</span>
        </button>
      </header>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar ejercicio..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ex) => (
          <div key={ex.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-200 relative flex items-center justify-center overflow-hidden">
               <img src={`https://picsum.photos/seed/${ex.id}/400/200`} alt={ex.title} className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/90 p-3 rounded-full shadow-lg">
                   <Play className="w-6 h-6 text-blue-600 fill-current" />
                 </div>
               </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{ex.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                  ex.category === 'Fuerza' ? 'bg-orange-100 text-orange-600' :
                  ex.category === 'Movilidad' ? 'bg-purple-100 text-purple-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {ex.category}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{ex.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-sm font-medium text-slate-400 italic">{ex.reps}</span>
                <button className="text-blue-600 font-bold hover:underline">Ver detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
