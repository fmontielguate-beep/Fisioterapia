
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
    { id: 'exercises', label: 'Mis Ejercicios', sub: 'Ver tu tabla personalizada', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'chat', label: 'Chat Fisioterapeuta', sub: 'Habla con tu profesional', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'prem', label: 'Feedback', sub: 'Valora tu tratamiento', icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">¡Hola, {patient.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500 mt-2 text-lg">Tu recuperación está en marcha. Sigue así.</p>
        </div>
        
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-emerald-50 flex items-center gap-8 min-w-[340px]">
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
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px] font-black mt-2 inline-block">v2.5.2 PRO</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6 shadow-sm border-l-8 border-l-emerald-600">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
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
          className="lg:col-span-2 group relative bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-100 cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ActivityIcon size={160} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight">Comenzar Sesión</h3>
              <p className="text-emerald-50 mb-8 max-w-xs text-lg">Inicia tu rutina guiada por IA ahora mismo para analizar tu técnica.</p>
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
            className="flex items-center gap-4 p-5 rounded-[2rem] border border-emerald-200 bg-white text-emerald-600 transition-all hover:scale-[1.02] hover:shadow-lg text-left"
          >
            <div className="p-4 bg-emerald-50 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Preguntar a la IA</h4>
              <p className="text-xs text-slate-500 font-medium">Asistente 24/7 disponible</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* ... Rest of the components follow the same green/white color theme ... */}
    </div>
  );
};

const ActivityIcon: React.FC<any> = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default Dashboard;
