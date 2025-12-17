
import React, { useState } from 'react';
import { Indicator, Language } from '../types';
import { Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';
import { analyzeSectionLiquidity } from '../services/geminiService';
import { UI_TEXT } from '../translations';

interface Props {
  title: string;
  indicators: Indicator[];
  colorTheme: 'blue' | 'indigo';
  lang: Language;
}

const SectionAnalysis: React.FC<Props> = ({ title, indicators, colorTheme, lang }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeSectionLiquidity(title, indicators, lang);
    setAnalysis(result);
    setLoading(false);
  };

  const themeClasses = colorTheme === 'blue' 
    ? 'bg-blue-50 border-blue-200 text-blue-900' 
    : 'bg-indigo-50 border-indigo-200 text-indigo-900';
    
  const btnTheme = colorTheme === 'blue'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-indigo-600 hover:bg-indigo-700';

  const t = UI_TEXT[lang].actions;

  return (
    <div className={`rounded-xl border p-6 mb-8 transition-all ${themeClasses}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorTheme === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <BrainCircuit size={20} />
            </div>
            <div>
                <h3 className="font-bold text-lg">{t.aiSectionTitle}</h3>
                <p className={`text-xs opacity-70 ${colorTheme === 'blue' ? 'text-blue-700' : 'text-indigo-700'}`}>
                    {t.aiSectionSubtitle}
                </p>
            </div>
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-all ${btnTheme} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
             <>
               <Sparkles size={14} className="animate-spin" /> {t.thinking}
             </>
          ) : (
             <>
               <Sparkles size={14} /> {t.aiSectionBtn}
             </>
          )}
        </button>
      </div>

      {analysis ? (
        <div className="prose prose-sm max-w-none text-gray-800 bg-white/50 p-4 rounded-lg border border-black/5">
            {/* Simple Markdown Rendering */}
            {analysis.split('###').map((section, idx) => {
                if (!section.trim()) return null;
                const [title, ...content] = section.split('\n');
                return (
                    <div key={idx} className="mb-4 last:mb-0">
                        <h4 className={`font-bold text-sm mb-2 uppercase tracking-wider ${colorTheme === 'blue' ? 'text-blue-600' : 'text-indigo-600'}`}>
                            {title.trim()}
                        </h4>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {content.join('\n').trim()}
                        </div>
                    </div>
                );
            })}
        </div>
      ) : (
        <div className="text-sm opacity-60 italic flex items-center gap-2 py-4">
            <ArrowRight size={14} />
            {t.aiSectionPlaceholder}
        </div>
      )}
    </div>
  );
};

export default SectionAnalysis;
