import React, { useState } from 'react';
import { 
  LayoutDashboard, Globe, Landmark, TrendingUp, Activity, Sparkles, CalendarDays, Video, X, Languages, Calendar, Twitter, ExternalLink, Heart
} from 'lucide-react';
import { SectionType, SubCategory, Indicator, Language } from './types';
import { ONSHORE_INDICATORS, OFFSHORE_INDICATORS, FED_INDICATORS, FED_EVENTS } from './constants';
import { UI_TEXT } from './translations';
import IndicatorCard from './components/IndicatorCard';
import ChartComponent from './components/ChartComponent';
import BubbleMap from './components/BubbleMap';
import SectionAnalysis from './components/SectionAnalysis'; 
import ReleaseCalendar from './components/ReleaseCalendar';
import { generateDemoVideo } from './services/videoService';

const POWELL_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Jerome_Powell_official_portrait.jpg/120px-Jerome_Powell_official_portrait.jpg";

const TwitterBadge = ({ variant = 'default' }: { variant?: 'default' | 'premium' }) => (
    <a 
      href="https://x.com/shenhh88" 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full transition-all shadow-sm active:scale-95
        ${variant === 'premium' 
          ? 'bg-black text-white border border-gray-800 hover:bg-gray-800' 
          : 'bg-white border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'}
      `}
    >
        <Twitter size={14} fill="currentColor" />
        <span className="text-[10px] md:text-xs font-black tracking-tight">@shenhh88</span>
    </a>
);

const AppFooter = () => (
    <div className="mt-12 mb-8 flex flex-col items-center justify-center gap-3 py-12 border-t border-gray-200/50">
        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span>Designed with</span>
            <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
        </div>
        <TwitterBadge variant="premium" />
        <p className="text-[9px] text-gray-400 font-medium">© 2025 Global USD Liquidity Watch Terminal</p>
    </div>
);

const SectionHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
  <div className="mb-6 border-b border-gray-200 pb-4">
    <div className="flex items-center gap-2 text-gray-800 mb-1">
      <Icon size={24} className="text-gray-600" />
      <h1 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h1>
    </div>
    <p className="text-gray-500 text-xs md:text-sm ml-8">{description}</p>
  </div>
);

const GroupTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mt-8 mb-4 border-l-4 border-black pl-3 bg-gray-50 py-1 rounded-r-lg">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">{title}</h2>
    </div>
);

enum ExtendedSectionType { CALENDAR = 'CALENDAR' }
type ViewType = SectionType | ExtendedSectionType;

function App() {
  const [activeSection, setActiveSection] = useState<ViewType>(SectionType.DASHBOARD);
  const [selectedChart, setSelectedChart] = useState<Indicator | null>(null);
  const [lang, setLang] = useState<Language>('zh');
  const [generatingVideo, setGeneratingVideo] = useState(false);

  const t = UI_TEXT[lang];

  const menuItems = [
    { id: SectionType.DASHBOARD, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: SectionType.ONSHORE_LIQUIDITY, label: t.nav.onshore, icon: Activity },
    { id: SectionType.OFFSHORE_LIQUIDITY, label: t.nav.offshore, icon: Globe },
    { id: SectionType.FED_POLICY, label: t.nav.fed, icon: Landmark },
    { id: ExtendedSectionType.CALENDAR, label: t.nav.calendar, icon: Calendar },
  ];

  const renderIndicatorGrid = (indicators: Indicator[]) => {
    const grouped = indicators.reduce((acc, ind) => {
      const cat = ind.subCategory;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ind);
      return acc;
    }, {} as Record<SubCategory, Indicator[]>);

    return Object.entries(grouped).map(([subCat, inds]) => (
      <div key={subCat} className="space-y-4">
        <GroupTitle title={t.subCategories[subCat as SubCategory]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inds.map(ind => (
            <IndicatorCard 
              key={ind.id} 
              indicator={ind} 
              onSelect={() => setSelectedChart(ind)} 
              selected={selectedChart?.id === ind.id} 
              lang={lang} 
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F7F7F5]">
      {/* PC Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-[#E9E9E7] bg-[#F7F7F5] fixed h-full flex-col justify-between z-40">
        <div className="p-5">
            <div className="mb-8 flex items-center justify-between">
              <div className="font-bold text-lg flex items-center gap-2">
                <img src={POWELL_AVATAR} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md" alt="Fed Chair" />
                <span className="tracking-tighter font-black">USD WATCH</span>
              </div>
            </div>
            <nav className="space-y-1.5">
              {menuItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveSection(item.id); setSelectedChart(null); }} 
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === item.id 
                    ? 'bg-black text-white shadow-xl translate-x-1' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
        </div>
        <div className="p-5 border-t border-[#E9E9E7] space-y-4">
             <div className="flex justify-between items-center px-1">
                <TwitterBadge />
                <button onClick={() => setLang(l => l==='zh'?'en':'zh')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 border border-transparent hover:border-gray-200 transition-all">
                  <Languages size={14}/>
                </button>
             </div>
             <button 
                onClick={async () => { setGeneratingVideo(true); await generateDemoVideo(); setGeneratingVideo(false); }} 
                disabled={generatingVideo} 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
             >
                {generatingVideo ? <Sparkles size={14} className="animate-spin" /> : <Video size={14} />} 
                {generatingVideo ? t.actions.generating : t.actions.generateVideo}
             </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
              <img src={POWELL_AVATAR} className="w-7 h-7 rounded-full object-cover border border-white shadow-sm" alt="Fed Chair" />
              <span className="text-[11px] font-black tracking-tight uppercase text-gray-900">USD Watch</span>
          </div>
          <div className="flex items-center gap-2">
              <TwitterBadge variant="premium" />
              <button onClick={() => setLang(l => l==='zh'?'en':'zh')} className="p-1.5 bg-white border border-gray-200 rounded-full text-gray-500 shadow-sm active:bg-gray-50">
                  <Languages size={14} />
              </button>
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-32 md:pb-8 max-w-7xl mx-auto w-full transition-all">
        {activeSection === SectionType.DASHBOARD && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <SectionHeader title={t.headers.dashboard.title} icon={LayoutDashboard} description={t.headers.dashboard.desc} />
                <div className="mb-6"><BubbleMap onshore={ONSHORE_INDICATORS} offshore={OFFSHORE_INDICATORS} onSelect={setSelectedChart} selectedId={selectedChart?.id} lang={lang} /></div>
                <SectionAnalysis title="Overview" indicators={[...ONSHORE_INDICATORS, ...OFFSHORE_INDICATORS]} colorTheme="blue" lang={lang} />
            </div>
        )}

        {activeSection === SectionType.FED_POLICY && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SectionHeader title={t.headers.fed.title} icon={Landmark} description={t.headers.fed.desc} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {FED_INDICATORS.map(ind => (
                        <div key={ind.id} className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden group hover:border-blue-400 transition-all">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-[0.2em]">{lang==='zh'?'核心政策指标':'POLICY CORE'}</div>
                                        <div className="text-xl font-black text-gray-900">{lang==='zh'?ind.name:ind.nameEn}</div>
                                    </div>
                                    <div className="text-3xl font-black text-gray-900 bg-gray-50 px-4 py-2 rounded-2xl shadow-inner">{ind.currentValue}{ind.unit}</div>
                                </div>
                                <div className="h-48 mt-4 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-2 relative">
                                    <ChartComponent data={ind.history} dataKey1={ind.code} height={170} color1="#2563EB" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 bg-gray-900 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white font-bold text-lg italic tracking-tight">
                            <CalendarDays size={20} className="text-blue-400" /> {t.fedTable.title}
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">2025-2026 Season</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black border-b">
                                <tr>
                                    <th className="px-8 py-4">{lang==='zh'?'会议日期':'DATE'}</th>
                                    <th className="px-8 py-4">{lang==='zh'?'类型':'TYPE'}</th>
                                    <th className="px-8 py-4">{lang==='zh'?'展望与结论':'OUTLOOK'}</th>
                                    <th className="px-8 py-4 text-center">{lang==='zh'?'影响':'IMPACT'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {FED_EVENTS.map((event, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-8 py-5 font-black text-gray-900 whitespace-nowrap">{event.date}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-1 ${event.type === 'Meeting' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'} text-[10px] rounded font-bold uppercase`}>
                                              {event.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-medium text-gray-600 min-w-[200px]">
                                          {lang === 'zh' ? event.summary : event.summaryEn}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-rose-500">
                                                <div className={`w-2 h-2 rounded-full bg-rose-500 ${event.impactLevel === 'High' ? 'animate-ping' : ''}`}></div> 
                                                {event.impactLevel}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeSection === SectionType.ONSHORE_LIQUIDITY && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <SectionHeader title={t.headers.onshore.title} icon={Activity} description={t.headers.onshore.desc} />
                {renderIndicatorGrid(ONSHORE_INDICATORS)}
                <SectionAnalysis title="Onshore" indicators={ONSHORE_INDICATORS} colorTheme="blue" lang={lang} />
            </div>
        )}

        {activeSection === SectionType.OFFSHORE_LIQUIDITY && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <SectionHeader title={t.headers.offshore.title} icon={Globe} description={t.headers.offshore.desc} />
                {renderIndicatorGrid(OFFSHORE_INDICATORS)}
                <SectionAnalysis title="Offshore" indicators={OFFSHORE_INDICATORS} colorTheme="indigo" lang={lang} />
            </div>
        )}

        {activeSection === ExtendedSectionType.CALENDAR && <ReleaseCalendar lang={lang} />}

        <AppFooter />

        {/* Detail Overlay */}
        {selectedChart && (
            <div className="fixed inset-x-0 bottom-[88px] md:bottom-8 md:right-8 md:left-auto md:w-[420px] mx-4 md:mx-0 bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-200 p-5 md:p-6 z-[100] animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-gray-900 flex items-center gap-2 tracking-tight text-sm md:text-base">
                        <TrendingUp size={18} className="text-blue-500"/> {lang==='zh'?selectedChart.name:selectedChart.nameEn}
                    </h3>
                    <button 
                        onClick={()=>setSelectedChart(null)} 
                        className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 active:scale-90"
                    >
                        <X size={20}/>
                    </button>
                </div>
                <div className="bg-gray-50 rounded-2xl p-2 md:p-3 border border-gray-100">
                    <ChartComponent 
                      data={selectedChart.history} 
                      dataKey1={selectedChart.code} 
                      height={window.innerWidth < 768 ? 160 : 220} 
                      color1="#2563EB" 
                    />
                </div>
                <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] md:text-[11px] font-semibold text-blue-700 leading-relaxed">
                        {lang==='zh'?selectedChart.description:selectedChart.descriptionEn}
                    </p>
                </div>
            </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 flex justify-around items-center px-4 py-3 z-50">
          {menuItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveSection(item.id); setSelectedChart(null); }} 
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  activeSection === item.id ? 'text-blue-600 bg-blue-50 font-black shadow-inner' : 'text-gray-400 font-medium'
                }`}
              >
                  <item.icon size={22} />
                  <span className="text-[8px] uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
              </button>
          ))}
      </nav>
    </div>
  );
}

export default App;