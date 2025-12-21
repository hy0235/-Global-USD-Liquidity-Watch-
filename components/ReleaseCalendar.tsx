
import React, { useState } from 'react';
import { Language } from '../types';
import { fetchIndicatorReleaseDates } from '../services/geminiService';
import { UI_TEXT } from '../translations';
import { Search, Calendar, ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  lang: Language;
}

interface CalendarData {
  text: string;
  sources: any[];
}

const ReleaseCalendar: React.FC<Props> = ({ lang }) => {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const t = UI_TEXT[lang].actions;

  const handleFetch = async () => {
    setLoading(true);
    try {
      const result = await fetchIndicatorReleaseDates(lang);
      // 确保 result.text 即使为 undefined 也能被处理为 string
      setData({
        text: result.text || "",
        sources: result.sources || []
      });
    } catch (e) {
      console.error(e);
      setData({ text: "Error fetching calendar data.", sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {lang === 'zh' ? '实时宏观日历查询' : 'Real-time Macro Calendar'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {lang === 'zh' 
              ? '查询未来几周内 TGA、PCE、NFP 等核心指标的发布时间。' 
              : 'Search for upcoming release dates of TGA, PCE, NFP and other core metrics.'}
          </p>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                {t.thinking}
              </>
            ) : (
              <>
                <Search size={18} />
                {t.fetchCalendar}
              </>
            )}
          </button>
        </div>
      </div>

      {data && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
              {data.text}
            </div>
          </div>

          {data.sources.length > 0 && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ExternalLink size={12} />
                {t.sources}
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((chunk, idx) => {
                  const uri = chunk.web?.uri || chunk.maps?.uri;
                  const title = chunk.web?.title || chunk.maps?.title || uri;
                  if (!uri) return null;
                  return (
                    <a
                      key={idx}
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center gap-1 max-w-[200px] truncate"
                    >
                      {title}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReleaseCalendar;

