
import React, { useState } from 'react';
import { Bookmark, Clock, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    setIsAnimating(true);
    // Reiniciar animación después de que termine
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
            {article.category}
          </span>
        </div>
        <button 
          onClick={handleSave}
          className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
            isSaved 
              ? 'bg-yellow-400 border-yellow-300 text-white shadow-lg shadow-yellow-200' 
              : 'bg-white/80 border-white/50 text-slate-400 hover:text-blue-500 hover:bg-white'
          } ${isAnimating ? 'scale-125' : 'scale-100'}`}
        >
          <Bookmark className={`w-5 h-5 transition-colors ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Clock className="w-3 h-3" />
          <span>{article.readTime} lectura</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-4 flex-1">
          {article.title}
        </h3>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
            Leer artículo <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
