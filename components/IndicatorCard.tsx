
import React from 'react';
import { Indicator, Language } from '../types';
import { TrendingUp, TrendingDown, Info, ExternalLink } from 'lucide-react';
import { UI_TEXT } from '../translations';

interface Props {
  indicator: Indicator;
  onSelect?: () => void;
  selected?: boolean;
  lang: Language;
}

const IndicatorCard: React.FC<Props> = ({ indicator, onSelect, selected, lang }) => {
  const isPositive = indicator.change >= 0;

  // Stop propagation to prevent card selection when clicking the link
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const name = lang === 'zh' ? indicator.name : indicator.nameEn;
  const description = lang === 'zh' ? indicator.description : indicator.descriptionEn;
  const comparisonText = lang === 'zh' ? '较上次' : 'vs last';
  const viewSourceText = UI_TEXT[lang].actions.viewSource;

  return (
    <div 
      onClick={onSelect}
      className={`
        p-4 rounded-lg border transition-all cursor-pointer group hover:shadow-sm flex flex-col justify-between
        ${selected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
      `}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
            {name}
            <div className="group/tooltip relative">
               <Info size={14} className="text-gray-300 hover:text-gray-500" />
               <div className="hidden group-hover/tooltip:block absolute z-10 w-48 p-2 mt-1 -ml-2 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none">
                  {description}
               </div>
            </div>
          </h3>
          <span className="text-xs text-gray-400 font-mono">{indicator.code}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-semibold text-gray-900">
            {indicator.currentValue}
            <span className="text-sm text-gray-500 ml-1">{indicator.unit}</span>
          </span>
        </div>

        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {Math.abs(indicator.change)}%
          <span className="text-gray-400 ml-2 font-normal">{comparisonText}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
        <span>{indicator.lastUpdated}</span>
        <a 
          href={indicator.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="flex items-center gap-1 font-medium bg-gray-50 hover:bg-gray-100 hover:text-blue-600 px-1.5 py-0.5 rounded text-gray-500 max-w-[50%] truncate transition-colors"
          title={`${viewSourceText}: ${indicator.source}`}
        >
           {indicator.source}
           <ExternalLink size={10} className="opacity-50" />
        </a>
      </div>
    </div>
  );
};

export default IndicatorCard;
