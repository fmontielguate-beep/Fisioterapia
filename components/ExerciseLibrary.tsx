
import React, { useState } from 'react';
// Added missing Activity icon import from lucide-react
import { Search, Plus, Filter, Play, ExternalLink, Youtube, Activity } from 'lucide-react';
import { Exercise } from '../types';

const ExerciseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockExercises: Exercise[] = [
    { id: '1', title: 'Sentadilla en Pared', description: 'Mantén la espalda apoyada y baja lentamente hasta formar 90º.', category: 'Fuerza', reps: '3 series de 10 reps', videoUrl: 'https://www.youtube.com/results?search_query=wall+squat+physiotherapy' },
    { id: '2', title: 'Puente de Glúteo', description: 'Eleva la cadera manteniendo el core firme y glúteos activos.', category: 'Fuerza', reps: '2 series de 15 reps', videoUrl: 'https://www.youtube.com/results?search_query=glute+bridge+physiotherapy' },
    { id: '3', title: 'Estiramiento Isquio', description: 'Tumbado boca arriba, utiliza una cincha para elevar la pierna.', category: 'Estiramiento', reps: '30 segundos cada pierna', videoUrl: 'https://www.youtube.com/results?search_query=hamstring+stretch+lying+down' },
    { id: '4', title: 'Movilidad Escapular', description: 'Rota los hombros suavemente hacia atrás disociando el cuello.', category: 'Movilidad', reps: '10 rotaciones', videoUrl: 'https://www.youtube.com/results?search_query=scapular+mobility+exercises' },
  ];

  const filtered = mockExercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase tracking-widest">Biblioteca Clínica</h2>
          <p className="text-slate-500 font-medium">Recursos de videoterapia y ejercicios terapéuticos.</p>
        </div>
        <button className="bg-emerald-600 text-white px-8 py-4 rounded-[2.5rem] font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-50">
          <Plus className="w-5 h-5" />
          <span>Añadir Nuevo</span>
        </button>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..."
            className="w-full pl-14 pr-6 py-4 rounded-[2rem] border border-slate-100 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((ex) => (
          <div key={ex.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
            <div className="h-56 bg-slate-900 relative flex items-center justify-center overflow-hidden">
               <img src={`https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400&seed=${ex.id}`} alt={ex.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/90 p-5 rounded-full shadow-2xl group-hover:scale-125 transition-transform">
                   <Play className="w-8 h-8 text-emerald-600 fill-current" />
                 </div>
               </div>
               <div className="absolute top-6 right-6">
                 <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md text-white border border-white/20 ${
                   ex.category === 'Fuerza' ? 'bg-orange-600/50' :
                   ex.category === 'Movilidad' ? 'bg-purple-600/50' :
                   'bg-blue-600/50'
                 }`}>
                   {ex.category}
                 </span>
               </div>
            </div>
            <div className="p-10 flex flex-col flex-1">
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{ex.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium italic">"{ex.description}"</p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Fixed missing Activity icon reference */}
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={16}/></div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{ex.reps}</span>
                </div>
                {ex.videoUrl && (
                  <a 
                    href={ex.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Youtube size={16} /> Ver Videoterapia
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;