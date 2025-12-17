
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Landmark, 
  TrendingUp,
  Activity,
  Sparkles,
  CalendarDays,
  Video,
  Download,
  X,
  Languages,
  Calendar
} from 'lucide-react';
import { SectionType, SubCategory, Indicator, Language } from './types';
import { ONSHORE_INDICATORS, OFFSHORE_INDICATORS, FED_INDICATORS, FED_EVENTS } from './constants';
import { UI_TEXT } from './translations';
import IndicatorCard from './components/IndicatorCard';
import ChartComponent from './components/ChartComponent';
import BubbleMap from './components/BubbleMap';
import SectionAnalysis from './components/SectionAnalysis'; 
import ReleaseCalendar from './components/ReleaseCalendar';
import { analyzeLiquidityImpact } from './services/geminiService';
import { generateDemoVideo } from './services/videoService';

// --- Sub-components for Sections ---

const SectionHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
  <div className="mb-6 border-b border-gray-200 pb-4">
    <div className="flex items-center gap-2 text-gray-800 mb-1">
      <Icon size={24} className="text-gray-600" />
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
    <p className="text-gray-500 text-sm ml-8">{description}</p>
  </div>
);

const AnalysisBlock = ({ usData, jpyData, lang }: { usData: Indicator[], jpyData: Indicator[], lang: Language }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeLiquidityImpact(usData, jpyData, lang);
    setAnalysis(result);
    setLoading(false);
  };

  const t = UI_TEXT[lang].actions;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-500" />
          {t.aiAnalysisTitle} (Dashboard)
        </h2>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? t.thinking : t.updateAnalysis}
        </button>
      </div>
      
      {analysis ? (
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line prose prose-sm">
          {analysis}
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">
          {t.aiAnalysisPlaceholder}
        </div>
      )}
    </div>
  );
};

const GroupedIndicators = ({ indicators, onSelect, selectedId, lang }: { indicators: Indicator[], onSelect: (i: Indicator) => void, selectedId?: string, lang: Language }) => {
    const grouped = indicators.reduce((acc, ind) => {
        const cat = ind.subCategory;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(ind);
        return acc;
    }, {} as Record<SubCategory, Indicator[]>);

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 pl-1 border-l-2 border-gray-300">
                        {UI_TEXT[lang].subCategories[category as SubCategory]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(ind => (
                            <IndicatorCard 
                                key={ind.id}
                                indicator={ind}
                                selected={selectedId === ind.id}
                                onSelect={() => onSelect(ind)}
                                lang={lang}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Define an extra SectionType for the Calendar
enum ExtendedSectionType {
    CALENDAR = 'CALENDAR'
}

type ViewType = SectionType | ExtendedSectionType;

// --- Main App ---

function App() {
  const [activeSection, setActiveSection] = useState<ViewType>(SectionType.DASHBOARD);
  const [selectedChart, setSelectedChart] = useState<Indicator | null>(null);
  const [lang, setLang] = useState<Language>('zh');
  
  // Video Generation State
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleBubbleSelect = (indicator: Indicator) => {
    setSelectedChart(indicator);
  };

  const handleGenerateVideo = async () => {
    setGeneratingVideo(true);
    setVideoError(null);
    try {
        const url = await generateDemoVideo();
        if (url) {
            setVideoUrl(url);
        } else {
            setVideoError(lang === 'zh' ? "视频生成未完成或已取消" : "Video generation cancelled or failed");
        }
    } catch (e: any) {
        setVideoError(e.message || (lang === 'zh' ? "生成过程中发生错误" : "Error during generation"));
    } finally {
        setGeneratingVideo(false);
    }
  };

  const toggleLanguage = () => {
      setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const t = UI_TEXT[lang];

  return (
    <div className="flex min-h-screen bg-[#F7F7F5] text-[#37352F]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E9E9E7] bg-[#F7F7F5] flex-shrink-0 fixed h-full z-10 hidden md:flex flex-col justify-between">
        <div>
            <div className="p-4 mb-4 flex items-center justify-between">
              <div className="font-bold text-lg flex items-center gap-2">
                <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs">M</div>
                {lang === 'zh' ? '流动性观察' : 'Liquidity'}
              </div>
              <button onClick={toggleLanguage} className="p-1.5 rounded hover:bg-gray-200 text-gray-500 flex items-center gap-1 text-[10px] font-bold" title="Switch Language">
                <Languages size={14} />
                {lang === 'zh' ? 'EN' : '中'}
              </button>
            </div>
            
            <nav className="px-2 space-y-1">
              <button 
                onClick={() => setActiveSection(SectionType.DASHBOARD)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.DASHBOARD ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <LayoutDashboard size={18} />
                {t.nav.dashboard}
              </button>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.nav.coreSections}
              </div>
              <button 
                onClick={() => setActiveSection(SectionType.ONSHORE_LIQUIDITY)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.ONSHORE_LIQUIDITY ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Activity size={18} />
                {t.nav.onshore}
              </button>
              <button 
                 onClick={() => setActiveSection(SectionType.OFFSHORE_LIQUIDITY)}
                 className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.OFFSHORE_LIQUIDITY ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Globe size={18} />
                {t.nav.offshore}
              </button>
              <button 
                onClick={() => setActiveSection(SectionType.FED_POLICY)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.FED_POLICY ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Landmark size={18} />
                {t.nav.fed}
              </button>
              <button 
                onClick={() => setActiveSection(ExtendedSectionType.CALENDAR)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === ExtendedSectionType.CALENDAR ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Calendar size={18} />
                {t.nav.calendar}
              </button>
            </nav>
        </div>

        {/* Sidebar Footer / Video Gen */}
        <div className="p-4 border-t border-[#E9E9E7] space-y-3">
             <button 
                onClick={handleGenerateVideo}
                disabled={generatingVideo}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded shadow-sm text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
             >
                {generatingVideo ? (
                    <>
                     <Sparkles size={12} className="animate-spin" /> {t.actions.generating}
                    </>
                ) : (
                    <>
                     <Video size={12} /> {t.actions.generateVideo}
                    </>
                )}
             </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {t.actions.systemRunning}
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 max-w-7xl mx-auto w-full relative">
        
        {/* Dynamic Header */}
        {activeSection === SectionType.DASHBOARD && (
           <SectionHeader title={t.headers.dashboard.title} icon={LayoutDashboard} description={t.headers.dashboard.desc} />
        )}
        {activeSection === SectionType.ONSHORE_LIQUIDITY && (
           <SectionHeader title={t.headers.onshore.title} icon={Activity} description={t.headers.onshore.desc} />
        )}
        {activeSection === SectionType.OFFSHORE_LIQUIDITY && (
           <SectionHeader title={t.headers.offshore.title} icon={Globe} description={t.headers.offshore.desc} />
        )}
        {activeSection === SectionType.FED_POLICY && (
           <SectionHeader title={t.headers.fed.title} icon={Landmark} description={t.headers.fed.desc} />
        )}
        {activeSection === ExtendedSectionType.CALENDAR && (
           <SectionHeader title={t.headers.calendar.title} icon={Calendar} description={t.headers.calendar.desc} />
        )}

        {/* --- DASHBOARD VIEW --- */}
        {activeSection === SectionType.DASHBOARD && (
            <>
                <div className="mb-8">
                  <BubbleMap 
                      onshore={ONSHORE_INDICATORS} 
                      offshore={OFFSHORE_INDICATORS} 
                      onSelect={handleBubbleSelect}
                      selectedId={selectedChart?.id}
                      lang={lang}
                  />
                </div>
                
                <AnalysisBlock usData={ONSHORE_INDICATORS} jpyData={OFFSHORE_INDICATORS} lang={lang} />
            </>
        )}

        {/* --- DETAIL VIEWS --- */}
        {activeSection === SectionType.ONSHORE_LIQUIDITY && (
            <>
             <SectionAnalysis 
                title={t.headers.onshore.title} 
                indicators={ONSHORE_INDICATORS} 
                colorTheme="blue" 
                lang={lang}
             />
             <GroupedIndicators 
                indicators={ONSHORE_INDICATORS} 
                onSelect={handleBubbleSelect} 
                selectedId={selectedChart?.id} 
                lang={lang}
             />
            </>
        )}

        {activeSection === SectionType.OFFSHORE_LIQUIDITY && (
            <>
             <SectionAnalysis 
                title={t.headers.offshore.title} 
                indicators={OFFSHORE_INDICATORS} 
                colorTheme="indigo" 
                lang={lang}
             />
             <GroupedIndicators 
                indicators={OFFSHORE_INDICATORS} 
                onSelect={handleBubbleSelect} 
                selectedId={selectedChart?.id} 
                lang={lang}
             />
            </>
        )}

        {/* --- FED POLICY SPECIAL VIEW --- */}
        {activeSection === SectionType.FED_POLICY && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Events & Speeches */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                             <CalendarDays size={18} className="text-gray-500"/>
                             <h3 className="font-semibold text-gray-700">{t.fedTable.title}</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                                {FED_EVENTS.map((event, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-32">{event.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-24">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${event.type === 'Meeting' ? 'bg-blue-100 text-blue-800' : 
                                                  event.type === 'Speech' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {event.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {event.speaker && <span className="font-bold text-gray-800 mr-2">{event.speaker}:</span>}
                                            {lang === 'zh' ? event.summary : event.summaryEn}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <div className={`w-2 h-2 rounded-full ${event.impactLevel === 'High' ? 'bg-red-500' : event.impactLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                                {event.impactLevel}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Key Metrics */}
                <div className="space-y-4">
                     {FED_INDICATORS.map(ind => (
                         <IndicatorCard 
                            key={ind.id}
                            indicator={ind}
                            selected={selectedChart?.id === ind.id}
                            onSelect={() => handleBubbleSelect(ind)}
                            lang={lang}
                         />
                     ))}
                </div>
            </div>
        )}

        {/* --- RELEASE CALENDAR VIEW --- */}
        {activeSection === ExtendedSectionType.CALENDAR && (
            <ReleaseCalendar lang={lang} />
        )}

        {/* --- GLOBAL CHART COMPONENT --- */}
        {selectedChart && activeSection !== ExtendedSectionType.CALENDAR && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky bottom-4 z-20 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600"/>
                {lang === 'zh' ? selectedChart.name : selectedChart.nameEn} ({selectedChart.code})
                </h2>
                <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                    {UI_TEXT[lang].subCategories[selectedChart.subCategory]}
                </div>
                <button onClick={() => setSelectedChart(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>
            
            <div className="space-y-2">
                <ChartComponent 
                    data={selectedChart.history} 
                    dataKey1={selectedChart.code} 
                    color1="#2563EB"
                    height={250}
                />
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
                    {lang === 'zh' ? selectedChart.description : selectedChart.descriptionEn} 
                </div>
            </div>
            </div>
        )}

        {/* --- VIDEO MODAL --- */}
        {videoUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Video size={18} className="text-purple-600"/>
                            {t.actions.generateVideo}
                        </h3>
                        <button onClick={() => setVideoUrl(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="bg-black aspect-video flex items-center justify-center">
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            className="w-full h-full"
                        />
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end">
                        <a 
                            href={videoUrl} 
                            download="liquidity-watch-demo.mp4"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Download size={16} />
                            {t.actions.downloadVideo}
                        </a>
                    </div>
                </div>
            </div>
        )}
        
        {/* Error Toast */}
        {videoError && (
            <div className="fixed bottom-8 right-8 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 shadow-lg text-sm z-50 animate-in slide-in-from-right">
                {videoError}
                <button onClick={() => setVideoError(null)} className="ml-2 underline">{t.actions.close}</button>
            </div>
        )}

      </main>
    </div>
  );
}

export default App;
