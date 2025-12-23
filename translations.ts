import { SubCategory } from './types';

export const UI_TEXT = {
  zh: {
    appTitle: '美元流动性观察',
    nav: {
      dashboard: '全景概览 (Graph)',
      coreSections: '核心板块',
      onshore: '在岸美元流动性',
      offshore: '离岸美元流动性',
      fed: '美联储政策',
      calendar: '数据发布日历'
    },
    headers: {
      dashboard: {
        title: '宏观全景概览',
        desc: '拖拽气泡探索指标关联。蓝色=在岸，紫色=离岸，红色=美联储。'
      },
      onshore: {
        title: '在岸美元流动性',
        desc: '核心监测：核心流动性 (General) / 回购市场 (Repo Market) / 美债基差 (Treasury Basis)。'
      },
      offshore: {
        title: '离岸美元流动性',
        desc: '核心监测：货币互换 (Cross-Currency Basis) / 日元市场 / 欧元市场。'
      },
      fed: {
        title: '美联储政策',
        desc: '官方 2025-2026 FOMC 会议日程、中性利率预测及政策路径。'
      },
      calendar: {
        title: '宏观发布日历',
        desc: '实时抓取 2025-2026 关键数据发布时间节点。'
      }
    },
    actions: {
      generateVideo: '生成演示视频',
      generating: '生成中 (需1-2分钟)...',
      close: '关闭',
      viewSource: '查看源数据',
      thinking: '分析中...',
      aiSectionTitle: 'AI 智能流动性推演',
      aiSectionSubtitle: '基于核心指标的逻辑推导',
      aiSectionBtn: '生成推论',
      aiSectionPlaceholder: '点击生成推论，AI 将深度挖掘本板块指标的内在联系。',
      fetchCalendar: '搜索最新发布日期',
      sources: '参考来源'
    },
    subCategories: {
      [SubCategory.GENERAL]: '核心流动性 (General)',
      [SubCategory.REPO_MARKET]: '回购市场 (Repo Market)',
      [SubCategory.TREASURY_BASIS]: '美债基差 (Treasury Basis)',
      [SubCategory.XCCY_BASIS]: '货币互换 (Cross-Currency Basis)',
      [SubCategory.JPY_MARKET]: '日元市场 (JPY Market)',
      [SubCategory.EURO_MARKET]: '欧元/离岸市场 (Euro Market)',
      [SubCategory.FED_RATES]: '基准利率 (EFFR)',
      [SubCategory.FED_DOTS]: '点阵图/中性利率'
    },
    fedTable: {
      title: '2025-2026 FOMC 官方日程表'
    }
  },
  en: {
    appTitle: 'USD Liquidity Watch',
    nav: {
      dashboard: 'Overview (Graph)',
      coreSections: 'CORE SECTIONS',
      onshore: 'Onshore Liquidity',
      offshore: 'Offshore Liquidity',
      fed: 'Fed Policy',
      calendar: 'Release Calendar'
    },
    headers: {
      dashboard: {
        title: 'Macro Overview',
        desc: 'Explore correlations via bubbles. Blue = Onshore, Purple = Offshore.'
      },
      onshore: {
        title: 'Onshore USD Liquidity',
        desc: 'Focus: General, Repo, and Treasury Basis.'
      },
      offshore: {
        title: 'Offshore USD Liquidity',
        desc: 'Focus: Cross-Currency Basis, JPY Market, Euro Market.'
      },
      fed: {
        title: 'Federal Reserve Policy',
        desc: 'Official 2025-2026 FOMC schedule and outlook.'
      },
      calendar: {
        title: 'Macro Calendar',
        desc: 'Live schedule powered by Google Search.'
      }
    },
    actions: {
      generateVideo: 'Generate Video',
      generating: 'Generating...',
      close: 'Close',
      viewSource: 'Source',
      thinking: 'Thinking...',
      aiSectionTitle: 'AI Insights',
      aiSectionSubtitle: 'Logic chain analysis',
      aiSectionBtn: 'Deduce',
      aiSectionPlaceholder: 'Generate causal chain analysis.',
      fetchCalendar: 'Fetch Latest Dates',
      sources: 'Sources'
    },
    subCategories: {
      [SubCategory.GENERAL]: 'Core Liquidity (General)',
      [SubCategory.REPO_MARKET]: 'Repo Market',
      [SubCategory.TREASURY_BASIS]: 'Treasury Basis',
      [SubCategory.XCCY_BASIS]: 'Cross-Currency Basis',
      [SubCategory.JPY_MARKET]: 'JPY Market',
      [SubCategory.EURO_MARKET]: 'Euro/Offshore Market',
      [SubCategory.FED_RATES]: 'EFFR Target',
      [SubCategory.FED_DOTS]: 'SEP Projections'
    },
    fedTable: {
      title: '2025-2026 FOMC Calendar'
    }
  }
};