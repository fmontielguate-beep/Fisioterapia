
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Minus, Maximize2 } from 'lucide-react';
import { getGlobalAIResponse } from '../services/geminiService';
import { UserRole, PhysioUser, PatientInfo } from '../types';

interface GlobalAssistantProps {
  role: UserRole;
  user?: PhysioUser | PatientInfo | null;
  version?: string;
}

const GlobalAssistant: React.FC<GlobalAssistantProps> = ({ role, user, version }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const welcomeText = role === 'physio' 
        ? `Hola Colega. Soy tu asistente clínico. ¿En qué puedo ayudarte con tus pacientes o razonamiento hoy?`
        : `¡Hola! Soy tu asistente de FisioSevilla. ¿Tienes alguna duda sobre tus ejercicios o cómo te sientes hoy?`;
      
      setMessages([{ sender: 'ai', text: welcomeText }]);
    }
  }, [isOpen, role]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    const response = await getGlobalAIResponse(userText, role, user);
    
    setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all hover:rotate-12 active:scale-95 group shadow-emerald-200"
      >
        <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-[100] w-80 sm:w-96 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.2)] border border-slate-100 flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      <header className={`p-4 flex items-center justify-between text-white bg-emerald-600`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight">Asistente {role === 'physio' ? 'Clínico' : 'IA'}</h4>
            {!isMinimized && <p className="text-[9px] opacity-70 uppercase font-black tracking-widest">{version || 'v2.5.2'} · Sede Sevilla</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
      </header>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-slate-50">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Escribe tu consulta..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalAssistant;
