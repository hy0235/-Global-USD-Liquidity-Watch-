import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Landmark, 
  TrendingUp,
  Activity,
  Lock,
  Sparkles,
  CalendarDays,
  Video,
  Download,
  X
} from 'lucide-react';
import { SectionType, SubCategory, Indicator, FOMCEvent } from './types';
import { ONSHORE_INDICATORS, OFFSHORE_INDICATORS, FED_INDICATORS, FED_EVENTS } from './constants';
import IndicatorCard from './components/IndicatorCard';
import ChartComponent from './components/ChartComponent';
import BubbleMap from './components/BubbleMap';
import SectionAnalysis from './components/SectionAnalysis'; 
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

const AnalysisBlock = ({ usData, jpyData }: { usData: Indicator[], jpyData: Indicator[] }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeLiquidityImpact(usData, jpyData);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-500" />
          AI 宏观综合分析 (Dashboard)
        </h2>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? '思考中...' : '更新分析'}
        </button>
      </div>
      
      {analysis ? (
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line prose prose-sm">
          {analysis}
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">
          点击更新以生成基于 TGA、RRP、基差及日元动态的综合流动性分析。
        </div>
      )}
    </div>
  );
};

const GroupedIndicators = ({ indicators, onSelect, selectedId }: { indicators: Indicator[], onSelect: (i: Indicator) => void, selectedId?: string }) => {
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
                        {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(ind => (
                            <IndicatorCard 
                                key={ind.id}
                                indicator={ind}
                                selected={selectedId === ind.id}
                                onSelect={() => onSelect(ind)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Main App ---

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.DASHBOARD);
  const [selectedChart, setSelectedChart] = useState<Indicator | null>(null);
  
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
            // Usually handled inside service, but just in case
            setVideoError("视频生成未完成或已取消");
        }
    } catch (e: any) {
        setVideoError(e.message || "生成过程中发生错误，请检查网络或 API Key");
    } finally {
        setGeneratingVideo(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F5] text-[#37352F]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E9E9E7] bg-[#F7F7F5] flex-shrink-0 fixed h-full z-10 hidden md:flex flex-col justify-between">
        <div>
            <div className="p-4 mb-4">
              <div className="font-bold text-lg flex items-center gap-2">
                <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs">M</div>
                美元流动性观察
              </div>
            </div>
            
            <nav className="px-2 space-y-1">
              <button 
                onClick={() => setActiveSection(SectionType.DASHBOARD)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.DASHBOARD ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <LayoutDashboard size={18} />
                概览 (Bubble Map)
              </button>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                核心板块
              </div>
              <button 
                onClick={() => setActiveSection(SectionType.ONSHORE_LIQUIDITY)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.ONSHORE_LIQUIDITY ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Activity size={18} />
                在岸美元流动性
              </button>
              <button 
                 onClick={() => setActiveSection(SectionType.OFFSHORE_LIQUIDITY)}
                 className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.OFFSHORE_LIQUIDITY ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Globe size={18} />
                离岸美元流动性
              </button>
              <button 
                onClick={() => setActiveSection(SectionType.FED_POLICY)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeSection === SectionType.FED_POLICY ? 'bg-[#EFEFED] text-black' : 'text-gray-500 hover:bg-[#EFEFED]'}`}
              >
                <Landmark size={18} />
                美联储政策
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
                     <Sparkles size={12} className="animate-spin" /> 生成中 (需1-2分钟)...
                    </>
                ) : (
                    <>
                     <Video size={12} /> 生成演示视频
                    </>
                )}
             </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                系统运行中
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 max-w-7xl mx-auto w-full relative">
        
        {/* Dynamic Header */}
        {activeSection === SectionType.DASHBOARD && (
           <SectionHeader title="全景概览" icon={LayoutDashboard} description="拖拽气泡以探索指标关联。气泡大小代表指标权重。" />
        )}
        {activeSection === SectionType.ONSHORE_LIQUIDITY && (
           <SectionHeader title="在岸美元流动性" icon={Activity} description="包含回购市场、美债基差 (Basis Trade) 及货币互换 (X-Ccy)。" />
        )}
        {activeSection === SectionType.OFFSHORE_LIQUIDITY && (
           <SectionHeader title="离岸美元流动性" icon={Globe} description="覆盖日元宏观套息交易及欧洲美元市场。" />
        )}
        {activeSection === SectionType.FED_POLICY && (
           <SectionHeader title="美联储政策" icon={Landmark} description="FOMC 日程、官员讲话及通胀/利率预测。" />
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
                  />
                </div>
                
                <AnalysisBlock usData={ONSHORE_INDICATORS} jpyData={OFFSHORE_INDICATORS} />
            </>
        )}

        {/* --- DETAIL VIEWS --- */}
        {activeSection === SectionType.ONSHORE_LIQUIDITY && (
            <>
             <SectionAnalysis 
                title="在岸美元流动性" 
                indicators={ONSHORE_INDICATORS} 
                colorTheme="blue" 
             />
             <GroupedIndicators 
                indicators={ONSHORE_INDICATORS} 
                onSelect={handleBubbleSelect} 
                selectedId={selectedChart?.id} 
             />
            </>
        )}

        {activeSection === SectionType.OFFSHORE_LIQUIDITY && (
            <>
             <SectionAnalysis 
                title="离岸美元流动性" 
                indicators={OFFSHORE_INDICATORS} 
                colorTheme="indigo" 
             />
             <GroupedIndicators 
                indicators={OFFSHORE_INDICATORS} 
                onSelect={handleBubbleSelect} 
                selectedId={selectedChart?.id} 
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
                             <h3 className="font-semibold text-gray-700">日程表 & 讲话</h3>
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
                                            {event.summary}
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
                         />
                     ))}
                </div>
            </div>
        )}

        {/* --- GLOBAL CHART COMPONENT --- */}
        {selectedChart && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky bottom-4 z-20 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600"/>
                {selectedChart.name} ({selectedChart.code})
                </h2>
                <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                    {selectedChart.subCategory}
                </div>
            </div>
            
            <div className="space-y-2">
                <ChartComponent 
                    data={selectedChart.history} 
                    dataKey1={selectedChart.code} 
                    color1="#2563EB"
                    height={250}
                />
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
                    {selectedChart.description} 
                    {selectedChart.correlationNote && <span className="block mt-1 text-gray-700 font-medium">{selectedChart.correlationNote}</span>}
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
                            应用演示视频
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
                            下载视频
                        </a>
                    </div>
                </div>
            </div>
        )}
        
        {/* Error Toast */}
        {videoError && (
            <div className="fixed bottom-8 right-8 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 shadow-lg text-sm z-50 animate-in slide-in-from-right">
                {videoError}
                <button onClick={() => setVideoError(null)} className="ml-2 underline">关闭</button>
            </div>
        )}

      </main>
    </div>
  );
}

export default App;