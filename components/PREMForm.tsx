
import React, { useState } from 'react';
import { Heart, Send, CheckCircle } from 'lucide-react';

const PREMForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">¡Gracias por tu feedback!</h2>
        <p className="text-slate-500">Tus respuestas nos ayudan a mejorar el servicio de rehabilitación en Sevilla.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-blue-600 font-bold mt-4"
        >
          Volver a evaluar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Tu Experiencia</h2>
        <p className="text-slate-500">¿Cómo te sientes con el tratamiento hoy?</p>
      </header>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <h4 className="font-bold text-slate-700">1. ¿Qué tan satisfecho estás con tu progreso semanal?</h4>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`flex-1 py-4 rounded-2xl border transition-all ${
                    rating === num 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'
                  }`}
                >
                  <span className="text-lg font-bold">{num}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 px-2">
              <span>Nada satisfecho</span>
              <span>Muy satisfecho</span>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="font-bold text-slate-700">2. ¿Sientes que la aplicación es fácil de usar?</h4>
            <div className="flex gap-4">
              {['Sí, muy sencilla', 'Regular', 'Tengo dificultades'].map((opt) => (
                <button key={opt} type="button" className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50">
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="font-bold text-slate-700">3. Comentarios adicionales</h4>
            <textarea 
              rows={4}
              placeholder="Cuéntanos cómo te sientes, si tienes algún dolor nuevo o qué te gustaría mejorar..."
              className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </section>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5" />
            Enviar Evaluación
          </button>
          
          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-red-400" /> Cuestionario PREM (Patient Reported Experience Measure)
          </p>
        </form>
      </div>
    </div>
  );
};

export default PREMForm;
