
import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  PlayCircle, 
  Star, 
  MessageCircle, 
  Sparkles, 
  Send, 
  Loader2, 
  TrendingUp, 
  ChevronRight, 
  Activity, 
  BookOpen, 
  X,
  ClipboardList,
  MessageSquare,
  Newspaper,
  CalendarDays
} from 'lucide-react';
import { PatientInfo, Message, NewsArticle } from '../types';
import { getAssistantResponse } from '../services/geminiService';
import NewsCard from './NewsCard';

interface DashboardProps {
  setView: (view: string) => void;
  patient: PatientInfo;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, patient }) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: `¡Hola ${patient.name.split(' ')[0]}! Soy tu asistente de recuperación. ¿Tienes alguna duda sobre tus ejercicios de hoy o tu progreso del ${patient.progress}%?`, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIChatOpen, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const aiResponse = await getAssistantResponse(inputValue, patient);
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const newsArticles: NewsArticle[] = [
    {
      id: 'n1',
      title: '5 consejos para cuidar tu rodilla tras la cirugía',
      category: 'Recuperación',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
      date: 'Hace 2 días',
      readTime: '4 min'
    },
    {
      id: 'n2',
      title: 'La importancia de la hidratación en fisioterapia',
      category: 'Bienestar',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400',
      date: 'Hace 5 días',
      readTime: '3 min'
    },
    {
      id: 'n3',
      title: 'Nuevos horarios en la clínica FisioSevilla Central',
      category: 'Clínica',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
      date: 'Ayer',
      readTime: '2 min'
    }
  ];

  const navCards = [
    { id: 'exercises', label: 'Mis Ejercicios', sub: 'Ver tu tabla personalizada', icon: BookOpen, color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { id: 'chat', label: 'Chat Fisioterapeuta', sub: 'Habla con tu profesional', icon: MessageSquare, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'prem', label: 'Feedback', sub: 'Valora tu tratamiento', icon: ClipboardList, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">¡Hola, {patient.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500 mt-2 text-lg">Tu recuperación está en marcha. Sigue así.</p>
        </div>
        
        {/* Anillo de progreso con viewBox para evitar clipping */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100 flex items-center gap-8 min-w-[340px]">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
               <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
               <circle 
                cx="60" cy="60" r="50" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={314} 
                strokeDashoffset={314 * (1 - patient.progress / 100)} 
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-1000 ease-in-out" 
               />
             </svg>
             <span className="absolute text-xl font-black text-slate-800 tracking-tighter">{patient.progress}%</span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Tu Progreso</p>
            <p className="text-xl font-black text-slate-700 leading-tight">Fase de Estabilización</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase">¡Casi a la mitad!</p>
          </div>
        </div>
      </header>

      {/* Nuevo Resumen de Evolución para el Paciente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6 shadow-sm border-l-8 border-l-blue-500">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <CalendarDays size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Día de Inicio</p>
            <p className="text-xl font-black text-slate-800">{new Date(patient.admissionDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Llevas {Math.floor((new Date().getTime() - new Date(patient.admissionDate).getTime()) / (1000 * 3600 * 24))} días con nosotros.</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6 shadow-sm border-l-8 border-l-emerald-500">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resumen de mi Evolución</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed italic line-clamp-2">"{patient.treatmentResponse || 'Tu fisioterapeuta está evaluando tu respuesta inicial.'}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => setView('monitoring')}
          className="lg:col-span-2 group relative bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ActivityIcon size={160} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-3">Comenzar Sesión</h3>
              <p className="text-blue-100 mb-8 max-w-xs text-lg">Inicia tu rutina guiada por IA ahora mismo para analizar tu técnica.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/20 w-fit px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/30 transition-colors">
              <PlayCircle className="w-6 h-6" />
              <span className="font-bold text-xl">Iniciar Ahora</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setView(card.id)}
                className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all hover:scale-[1.02] hover:shadow-lg ${card.color} text-left`}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{card.label}</h4>
                  <p className="text-xs text-slate-500 font-medium">{card.sub}</p>
                </div>
              </button>
            );
          })}
          
          <button 
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-4 p-5 rounded-[2rem] border border-blue-200 bg-white text-blue-600 transition-all hover:scale-[1.02] hover:shadow-lg text-left"
          >
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Preguntar a la IA</h4>
              <p className="text-xs text-slate-500 font-medium">Asistente 24/7 disponible</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <BookOpenIcon className="text-blue-500 w-6 h-6" /> Ejercicios para hoy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patient.assignedExercises.map((ex, i) => (
              <div key={ex.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500" onClick={() => setView('exercises')}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} rounded-2xl flex items-center justify-center`}>
                    <ActivityIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{ex.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{ex.reps}</p>
                  </div>
                </div>
                <div className="p-2 group-hover:bg-blue-50 rounded-xl transition-colors">
                  <ChevronRightIcon className="w-6 h-6 text-slate-300 group-hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-100 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-20"><TrendingUp className="w-40 h-40" /></div>
            <div className="bg-white/20 p-4 rounded-2xl w-fit mb-6 backdrop-blur-md"><Star className="w-8 h-8 fill-current text-white" /></div>
            <h4 className="font-bold text-2xl mb-2 italic">"Cada paso cuenta"</h4>
            <p className="text-green-50 text-base leading-relaxed">Has mantenido tu racha de 4 días. ¡Solo faltan 3 más para completar el objetivo semanal!</p>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl"><Calendar className="w-6 h-6 text-slate-400" /></div>
                <h4 className="font-bold text-slate-800 text-lg">Próxima Cita</h4>
             </div>
             <div className="space-y-1">
               <p className="text-xl font-black text-slate-800">Miércoles, 25 Oct</p>
               <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">10:30h • Presencial</p>
             </div>
          </div>
        </aside>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-blue-500" />
            <h3 className="text-2xl font-bold text-slate-800">Tu Guía de Salud</h3>
          </div>
          <button className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
            Ver todo el contenido <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {isAIChatOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[650px] sm:rounded-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Asistente de Recuperación</h3>
                  <p className="text-[10px] text-blue-100 opacity-80 uppercase font-bold tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    En línea
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-7 h-7" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-100' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-[1.5rem] rounded-tl-none p-4 border border-slate-100 shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Dime algo..."
                  className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95"><Send className="w-6 h-6" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Re-defining internal icons for self-sufficiency
const ActivityIcon: React.FC<any> = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
const ChevronRightIcon: React.FC<any> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const BookOpenIcon: React.FC<any> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

export default Dashboard;
