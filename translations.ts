
import { SectionType, SubCategory, Language } from './types';

export const UI_TEXT = {
  zh: {
    appTitle: '美元流动性观察',
    nav: {
      dashboard: '概览 (Bubble Map)',
      coreSections: '核心板块',
      onshore: '在岸美元流动性',
      offshore: '离岸美元流动性',
      fed: '美联储政策',
      calendar: '数据发布日历'
    },
    headers: {
      dashboard: {
        title: '全景概览',
        desc: '拖拽气泡以探索指标关联。气泡大小代表指标权重。'
      },
      onshore: {
        title: '在岸美元流动性',
        desc: '包含回购市场、美债基差 (Basis Trade) 及货币互换 (X-Ccy)。'
      },
      offshore: {
        title: '离岸美元流动性',
        desc: '覆盖日元宏观套息交易及欧洲美元市场。'
      },
      fed: {
        title: '美联储政策',
        desc: 'FOMC 日程、官员讲话及通胀/利率预测。'
      },
      calendar: {
        title: '宏观日历 (实时搜索)',
        desc: '利用 Google Search 实时获取最新的指标发布日程。'
      }
    },
    actions: {
      generateVideo: '生成演示视频',
      generating: '生成中 (需1-2分钟)...',
      systemRunning: '系统运行中',
      downloadVideo: '下载视频',
      close: '关闭',
      viewSource: '查看源数据',
      updateAnalysis: '更新分析',
      thinking: '思考中...',
      aiAnalysisTitle: 'AI 宏观综合分析',
      aiAnalysisPlaceholder: '点击更新以生成基于 TGA、RRP、基差及日元动态的综合流动性分析。',
      aiSectionTitle: 'AI 智能流动性推演',
      aiSectionSubtitle: '基于核心指标的实时逻辑分析',
      aiSectionBtn: '生成结论',
      aiSectionPlaceholder: '点击上方按钮，AI 将根据当前的指标组合进行因果链推导。',
      fetchCalendar: '查询最新发布日期',
      sources: '参考来源'
    },
    subCategories: {
      [SubCategory.GENERAL_ONSHORE]: '核心流动性 (General)',
      [SubCategory.REPO_MARKET]: '回购市场 (Repo Market)',
      [SubCategory.TREASURY_BASIS]: '美债基差 (Treasury Basis Trade)',
      [SubCategory.XCCY_BASIS]: '货币互换 (Cross-Currency Basis)',
      [SubCategory.JPY_MACRO]: '日元宏观 (JPY Macro)',
      [SubCategory.EURO_MARKET]: '欧元市场 (Euro Market)',
      [SubCategory.FED_RATES]: '利率与通胀',
      [SubCategory.FED_DOTS]: '点阵图预测'
    },
    fedTable: {
      title: '日程表 & 讲话'
    }
  },
  en: {
    appTitle: 'USD Liquidity Watch',
    nav: {
      dashboard: 'Overview (Bubble Map)',
      coreSections: 'CORE SECTIONS',
      onshore: 'Onshore Liquidity',
      offshore: 'Offshore Liquidity',
      fed: 'Fed Policy',
      calendar: 'Release Calendar'
    },
    headers: {
      dashboard: {
        title: 'Dashboard Overview',
        desc: 'Drag bubbles to explore correlations. Bubble size represents indicator weight.'
      },
      onshore: {
        title: 'Onshore USD Liquidity',
        desc: 'Repo Market, Treasury Basis Trade, and Cross-Currency Swaps.'
      },
      offshore: {
        title: 'Offshore USD Liquidity',
        desc: 'JPY Macro Carry Trade and Eurodollar Markets.'
      },
      fed: {
        title: 'Federal Reserve Policy',
        desc: 'FOMC Schedule, Speeches, and Inflation/Rate Projections.'
      },
      calendar: {
        title: 'Macro Calendar (Live Search)',
        desc: 'Real-time schedule of macro indicators powered by Google Search.'
      }
    },
    actions: {
      generateVideo: 'Generate Demo Video',
      generating: 'Generating (1-2 min)...',
      systemRunning: 'System Operational',
      downloadVideo: 'Download Video',
      close: 'Close',
      viewSource: 'Source',
      updateAnalysis: 'Update Analysis',
      thinking: 'Thinking...',
      aiAnalysisTitle: 'AI Macro Synthesis',
      aiAnalysisPlaceholder: 'Click update to generate comprehensive analysis based on TGA, RRP, Basis, and JPY dynamics.',
      aiSectionTitle: 'AI Liquidity Deduction',
      aiSectionSubtitle: 'Real-time logic analysis based on core indicators',
      aiSectionBtn: 'Generate Insights',
      aiSectionPlaceholder: 'Click the button above to let AI deduce causal chains based on current metrics.',
      fetchCalendar: 'Fetch Latest Dates',
      sources: 'Sources'
    },
    subCategories: {
      [SubCategory.GENERAL_ONSHORE]: 'General Liquidity',
      [SubCategory.REPO_MARKET]: 'Repo Market',
      [SubCategory.TREASURY_BASIS]: 'Treasury Basis Trade',
      [SubCategory.XCCY_BASIS]: 'Cross-Currency Basis',
      [SubCategory.JPY_MACRO]: 'JPY Macro',
      [SubCategory.EURO_MARKET]: 'Euro Market',
      [SubCategory.FED_RATES]: 'Rates & Inflation',
      [SubCategory.FED_DOTS]: 'Dot Plot Projections'
    },
    fedTable: {
      title: 'Schedule & Speeches'
    }
  }
};
