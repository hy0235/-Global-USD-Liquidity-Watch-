
import React, { useState } from 'react';
import { Indicator, Language } from '../types';
import { TrendingUp, TrendingDown, Info, ExternalLink, RefreshCw } from 'lucide-react';
import { UI_TEXT } from '../translations';
import { fetchLiveIndicatorValue } from '../services/geminiService';

interface Props {
  indicator: Indicator;
  onSelect?: () => void;
  selected?: boolean;
  lang: Language;
}

const IndicatorCard: React.FC<Props> = ({ indicator, onSelect, selected, lang }) => {
  const [liveValue, setLiveValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isPositive = indicator.change >= 0;

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const result = await fetchLiveIndicatorValue(indicator, lang);
      setLiveValue(result.value);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const name = lang === 'zh' ? indicator.name : indicator.nameEn;
  const description = lang === 'zh' ? indicator.description : indicator.descriptionEn;

  return (
    <div 
      onClick={onSelect}
      className={`
        p-4 rounded-lg border transition-all cursor-pointer group hover:shadow-sm flex flex-col justify-between h-full
        ${selected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
      `}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
            {name}
            <div className="group/tooltip relative">
               <Info size={14} className="text-gray-300 hover:text-gray-500" />
               <div className="hidden group-hover/tooltip:block absolute z-20 w-48 p-2 mt-1 -ml-2 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none">
                  {description}
               </div>
            </div>
          </h3>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
            title={lang === 'zh' ? 'AI 抓取最新数据' : 'Fetch live data via AI'}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-semibold text-gray-900">
            {liveValue || indicator.currentValue}
            {!liveValue && <span className="text-sm text-gray-500 ml-1">{indicator.unit}</span>}
          </span>
        </div>

        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {Math.abs(indicator.change)}%
          <span className="text-gray-400 ml-2 font-normal">{lang === 'zh' ? '较上次' : 'vs last'}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
        <span>{indicator.lastUpdated}</span>
        <a 
          href={indicator.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 font-medium bg-gray-50 hover:bg-gray-100 hover:text-blue-600 px-1.5 py-0.5 rounded transition-colors"
        >
           {indicator.source}
           <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};

export default IndicatorCard;
