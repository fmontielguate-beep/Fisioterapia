
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, UserCheck, Sparkles, Phone, Video } from 'lucide-react';
import { Message } from '../types';

interface ChatProps {
  recipientName: string;
  isPhysioView?: boolean;
}

const Chat: React.FC<ChatProps> = ({ recipientName, isPhysioView = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: isPhysioView ? 'user' : 'physio', 
      text: isPhysioView 
        ? 'Hola Manuel, he completado mi rutina pero noto algo de tirantez.' 
        : '¡Hola Juan! ¿Cómo vas con los ejercicios de rodilla de hoy?', 
      timestamp: new Date() 
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: isPhysioView ? 'physio' : 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    // Simulated automated response for demo
    if (!isPhysioView) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'He registrado tu progreso. ¡Excelente trabajo! Recuerda no forzar si sientes dolor punzante.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
      <header className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {isPhysioView ? <User className="text-blue-600 w-5 h-5" /> : <UserCheck className="text-blue-600 w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{recipientName}</h3>
            <p className="text-xs text-green-600 font-medium">En línea</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
           <Phone className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
           <Video className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isOwnMessage = (isPhysioView && msg.sender === 'physio') || (!isPhysioView && msg.sender === 'user');
          return (
            <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                isOwnMessage 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100' 
                  : msg.sender === 'ai'
                    ? 'bg-green-50 border border-green-100 text-slate-800 rounded-tl-none italic flex gap-2'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {msg.sender === 'ai' && <Sparkles className="w-4 h-4 text-green-600 shrink-0 mt-1" />}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isOwnMessage ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
