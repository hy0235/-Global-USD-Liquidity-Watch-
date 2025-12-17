import { SectionType, SubCategory, Indicator, FOMCEvent } from './types';

// --- Helpers ---
const generateHistory = (startValue: number, volatility: number, count: number = 60): any[] => {
  let current = startValue;
  const data = [];
  const today = new Date();
  for (let i = count; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const change = (Math.random() - 0.5) * volatility;
    current += change;
    data.push({
      date: d.toISOString().split('T')[0],
      value: Number(current.toFixed(2)),
    });
  }
  return data;
};

const generatePolicyRateHistory = (currentRate: number, count: number = 180): any[] => {
  const data = [];
  const today = new Date();
  const decCutDate = new Date('2024-12-18');
  const novCutDate = new Date('2024-11-07');
  const septCutDate = new Date('2024-09-18');

  for (let i = count; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    let value = currentRate; 
    if (d < septCutDate) value = 5.50; 
    else if (d < novCutDate) value = 5.00; 
    else if (d < decCutDate) value = 4.75; 
    else value = 4.50; 

    data.push({ date: d.toISOString().split('T')[0], value: Number(value.toFixed(2)) });
  }
  return data;
};

const generateRealisticDotPlotHistory = (targetYear: '2025' | '2026', count: number = 200): any[] => {
    const data = [];
    const today = new Date();
    // Simulation of market pricing adjusting over time
    for (let i = count; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        let value = targetYear === '2025' ? 3.4 : 2.9;
        // Add some noise
        value += (Math.random() - 0.5) * 0.1;
        data.push({ date: d.toISOString().split('T')[0], value: Number(value.toFixed(2)) });
    }
    return data;
}

// ==========================================
// 1. ONSHORE USD LIQUIDITY (在岸美元流动性)
// ==========================================

export const ONSHORE_INDICATORS: Indicator[] = [
  // --- A. General Onshore (Core) ---
  {
    id: 'on-1',
    name: '财政部一般账户 (TGA)',
    code: 'TGA',
    description: '财政部在美联储的现金余额。TGA 增加 = 抽水（吸收准备金）；TGA 减少 = 放水（释放准备金）。',
    currentValue: 725.4, // Realistic 2025 buffer
    unit: '$B',
    change: 12.5,
    lastUpdated: '实时',
    source: 'FRED (WTREGEN)',
    sourceUrl: 'https://fred.stlouisfed.org/series/WTREGEN',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.GENERAL_ONSHORE,
    weight: 9, 
    history: generateHistory(710, 15),
  },
  {
    id: 'on-2',
    name: '美联储总资产 (Total Assets)',
    code: 'WALCL',
    description: '衡量 QT (量化紧缩) 进度的核心指标。缩表直接减少系统内的基础货币。',
    currentValue: 6750, // Continuing runoff
    unit: '$B',
    change: -25.0,
    lastUpdated: '周更',
    source: 'FRED (WALCL)',
    sourceUrl: 'https://fred.stlouisfed.org/series/WALCL',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.GENERAL_ONSHORE,
    weight: 8,
    history: generateHistory(6800, 5),
  },

  // --- B. Repo Market (回购市场) ---
  {
    id: 'repo-1',
    name: '隔夜逆回购 (ON RRP)',
    code: 'ON RRP',
    description: '货币基金的资金蓄水池。RRP 余额下降通常意味着资金回流到国债或回购市场，不仅未抽水，反而支撑流动性。',
    currentValue: 315.2, 
    unit: '$B',
    change: -5.4,
    lastUpdated: '每日 1:15 PM ET',
    source: 'NY Fed',
    sourceUrl: 'https://www.newyorkfed.org/markets/desk-operations/reverse-repo',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.REPO_MARKET,
    weight: 9,
    history: generateHistory(325, 8),
  },
  {
    id: 'repo-2',
    name: '担保隔夜融资利率 (SOFR)',
    code: 'SOFR',
    description: '回购市场基准利率。若 SOFR 大幅偏离联邦基金利率，表明抵押品稀缺或融资市场压力。',
    currentValue: 4.30,
    unit: '%',
    change: 0.00,
    lastUpdated: '每日 8:00 AM ET',
    source: 'NY Fed',
    sourceUrl: 'https://www.newyorkfed.org/markets/reference-rates/sofr',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.REPO_MARKET,
    weight: 7,
    history: generatePolicyRateHistory(4.30), 
  },
  {
    id: 'repo-3',
    name: '回购利率与储备利息差 (SOFR-IORB)',
    code: 'SOFR-IORB',
    description: '套利空间指标。正值意味着银行通过回购放贷比存央行更划算，负值则相反。',
    currentValue: -0.10, // IORB usually floor + margin. 4.30 (SOFR) - 4.40 (IORB) = -0.10 roughly in cutting cycle
    unit: 'bps',
    change: 0.01,
    lastUpdated: '计算值',
    source: 'FRED',
    sourceUrl: 'https://fred.stlouisfed.org/series/IORB',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.REPO_MARKET,
    weight: 6,
    history: generateHistory(-0.10, 0.02),
  },
  {
    id: 'repo-4',
    name: '有效联邦基金利率 (EFFR)',
    code: 'EFFR',
    description: '银行间无担保拆借利率。美联储政策利率的实际执行情况。',
    currentValue: 4.33,
    unit: '%',
    change: 0.0,
    lastUpdated: '每日',
    source: 'NY Fed',
    sourceUrl: 'https://www.newyorkfed.org/markets/reference-rates/effr',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.REPO_MARKET,
    weight: 5,
    history: generatePolicyRateHistory(4.33),
  },

  // --- C. Treasury Basis Trade (美债基差交易) ---
  {
    id: 'basis-1',
    name: '现货期货基差 (Cash-Futures Basis)',
    code: 'UST Basis',
    description: '衡量期货与现货的价差。基差过大吸引对冲基金进行“基差交易”（做空期货，做多现货）。',
    currentValue: 0.38,
    unit: 'bps',
    change: -0.02,
    lastUpdated: '实时',
    source: 'CME Group',
    sourceUrl: 'https://www.cmegroup.com/markets/interest-rates/us-treasury/basis-spreads.html',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.TREASURY_BASIS,
    weight: 8,
    history: generateHistory(0.40, 0.05),
  },
  {
    id: 'basis-2',
    name: '杠杆基金美债期货净空头 (CFTC)',
    code: 'Lev Net Shorts',
    description: 'CFTC 持仓报告。极端的空头头寸通常代表基差交易的拥挤程度，存在平仓踩踏风险。',
    currentValue: -750, 
    unit: 'k contracts',
    change: -15,
    lastUpdated: '周二 (发布于周五)',
    source: 'CFTC / Tradingster',
    sourceUrl: 'https://www.cftc.gov/dea/futures/financial_lf.htm',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.TREASURY_BASIS,
    weight: 9,
    history: generateHistory(-740, 20),
  },
  {
    id: 'basis-3',
    name: '隐含融资利率 (Implied Repo Rate)',
    code: 'Imp Repo',
    description: '期货定价隐含的资金成本。若低于实际 SOFR，做空期货的成本较低，利于基差交易。',
    currentValue: 4.35,
    unit: '%',
    change: 0.01,
    lastUpdated: '每日',
    source: 'CME Analytics',
    sourceUrl: 'https://www.cmegroup.com/tools-information/quikstrike/treasury-analytics.html',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.TREASURY_BASIS,
    weight: 6,
    history: generateHistory(4.32, 0.02),
  },

  // --- D. Cross-Currency Basis Swaps (Included in Onshore as requested) ---
  {
    id: 'xccy-1',
    name: '欧元/美元 3个月互换基差',
    code: 'EURCBS 3M',
    description: '非美机构获取美元的“溢价”。负值越大，代表离岸市场美元越短缺。',
    currentValue: -14.2,
    unit: 'bps',
    change: -0.5,
    lastUpdated: '实时',
    source: 'Investing.com',
    sourceUrl: 'https://www.investing.com/rates-bonds/forward-rates',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.XCCY_BASIS,
    weight: 7,
    history: generateHistory(-13, 0.8),
  },
  {
    id: 'xccy-4',
    name: '央行流动性互换 (Swap Lines)',
    code: 'Swap Lines',
    description: '美联储与其他央行的紧急美元互换余额。主要用于应对严重的离岸美元枯竭。',
    currentValue: 0.4, 
    unit: '$B',
    change: 0,
    lastUpdated: '周四',
    source: 'NY Fed',
    sourceUrl: 'https://apps.newyorkfed.org/markets/autorates/fxswaps-search-page',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.XCCY_BASIS,
    weight: 4,
    history: generateHistory(0.4, 0.01),
  },
];

// ==========================================
// 2. OFFSHORE USD LIQUIDITY (离岸美元流动性)
// ==========================================

export const OFFSHORE_INDICATORS: Indicator[] = [
  // --- A. JPY Macro (日元宏观) ---
  {
    id: 'jp-1',
    name: '美元/日元 (USD/JPY)',
    code: 'USDJPY',
    description: '日元套息交易（Carry Trade）的核心。汇率波动直接影响日资机构抛售美债的动力。',
    currentValue: 142.50,
    unit: '¥',
    change: 0.3,
    lastUpdated: '实时',
    source: 'Yahoo Finance',
    sourceUrl: 'https://finance.yahoo.com/quote/USDJPY=X/',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO,
    weight: 10,
    history: generateHistory(141, 1.2),
  },
  {
    id: 'jp-2',
    name: '10年期日本国债收益率 (JGB 10Y)',
    code: 'JP10Y',
    description: '日本长债收益率。若大幅上升，将吸引日本国内资金回流，减少对美债的购买。',
    currentValue: 1.15,
    unit: '%',
    change: 0.02,
    lastUpdated: '实时',
    source: 'Japan MOF',
    sourceUrl: 'https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/index.htm',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO,
    weight: 8,
    history: generateHistory(1.10, 0.03),
  },
  {
    id: 'jp-3',
    name: '日本央行政策利率 (BoJ Rate)',
    code: 'BOJ Rate',
    description: '日本无担保隔夜拆借利率目标。加息是结束全球廉价资金时代的关键信号。',
    currentValue: 0.50, // Projected 2025 hike
    unit: '%',
    change: 0,
    lastUpdated: 'BoJ 决议',
    source: 'Bank of Japan',
    sourceUrl: 'https://www.boj.or.jp/en/index.htm',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO,
    weight: 7,
    history: generateRealisticDotPlotHistory('2026', 120).map(i => ({...i, value: 0.5})),
  },
  {
    id: 'jp-4',
    name: '日元/美元 3个月互换基差',
    code: 'JPYCBS 3M',
    description: '日元融资成本。负值极深通常意味着日资机构为了对冲美债汇率风险在支付高昂成本。',
    currentValue: -32.0,
    unit: 'bps',
    change: 1.5,
    lastUpdated: '实时',
    source: 'Investing.com',
    sourceUrl: 'https://www.investing.com/currencies/usd-jpy',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO, // Put in JPY Macro as it links heavily
    weight: 7,
    history: generateHistory(-35, 1.5),
  },

  // --- B. Euro Market (欧元市场) ---
  {
    id: 'eu-1',
    name: '离岸美元信贷 (Global Liquidity)',
    code: 'BIS GLI',
    description: '美国境外非银行机构的美元信贷总量。全球影子银行美元创造能力的终极指标。',
    currentValue: 13.8,
    unit: '$Trillion',
    change: 0.1,
    lastUpdated: '季度 (BIS)',
    source: 'BIS',
    sourceUrl: 'https://www.bis.org/statistics/gli.htm',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.EURO_MARKET,
    weight: 8,
    history: generateHistory(13.6, 0.05),
  },
  {
    id: 'eu-2',
    name: '外国持有的美元存款 (Custody)',
    code: 'Fed Custody',
    description: '美联储为外国官方账户托管的美国证券。减少通常意味着外国央行在抛售美债以干预汇率。',
    currentValue: 3.42, 
    unit: '$Trillion',
    change: -0.01,
    lastUpdated: '周四',
    source: 'FRED (H.4.1)',
    sourceUrl: 'https://fred.stlouisfed.org/series/WSHOSHO',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.EURO_MARKET,
    weight: 6,
    history: generateHistory(3.45, 0.02),
  },
];

// ==========================================
// 3. FED POLICY (美联储政策)
// ==========================================

export const FED_INDICATORS: Indicator[] = [
  {
    id: 'fed-1',
    name: '联邦基金利率目标 (上限)',
    code: 'FFR Target',
    description: '美联储货币政策的核心控制目标。',
    currentValue: 4.50,
    unit: '%',
    change: 0,
    lastUpdated: 'FOMC',
    source: 'Federal Reserve',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/openmarket.htm',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_RATES,
    weight: 10,
    history: generatePolicyRateHistory(4.50),
  },
  {
    id: 'fed-2',
    name: 'FOMC 经济预测 (2025年中位数)',
    code: 'SEP 2025',
    description: '即“点阵图”。反映 FOMC 委员对 2025 年底利率水平的一致预期。',
    currentValue: 3.4,
    unit: '%',
    change: 0,
    lastUpdated: '2024-12-18',
    source: 'Federal Reserve',
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_DOTS,
    weight: 9,
    history: generateRealisticDotPlotHistory('2025'),
  },
  {
    id: 'fed-3',
    name: '核心 PCE 物价指数 (YoY)',
    code: 'Core PCE',
    description: '美联储最看重的通胀指标（剔除食品和能源）。目标为 2%。',
    currentValue: 2.6,
    unit: '%',
    change: -0.1,
    lastUpdated: '月度 (BEA)',
    source: 'BEA / FRED',
    sourceUrl: 'https://fred.stlouisfed.org/series/PCEPILFE',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_RATES,
    weight: 8,
    history: generateHistory(2.7, 0.05),
  },
  {
    id: 'fed-4',
    name: 'Breakeven 通胀率 (5年期)',
    code: '5Y Breakeven',
    description: '市场预期的未来 5 年平均通胀率（名义美债与 TIPS 之差）。',
    currentValue: 2.15,
    unit: '%',
    change: 0.02,
    lastUpdated: '每日',
    source: 'FRED',
    sourceUrl: 'https://fred.stlouisfed.org/series/T5YIE',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_RATES,
    weight: 6,
    history: generateHistory(2.10, 0.05),
  }
];

export const FED_EVENTS: FOMCEvent[] = [
  // 模拟 2025 上半年关键节点
  { date: '2025-02-21', type: 'Speech', summary: '理事 Waller 讨论住房通胀问题', impactLevel: 'Medium', speaker: 'Waller' },
  { date: '2025-02-28', type: 'Data Release', summary: '1月 PCE 物价指数发布', impactLevel: 'High' },
  { date: '2025-03-07', type: 'Data Release', summary: '2月 非农就业报告 (NFP)', impactLevel: 'High' },
  { date: '2025-03-19', type: 'Meeting', summary: 'FOMC 利率决议 & 季度经济预测 (SEP)', impactLevel: 'High' },
  { date: '2025-04-10', type: 'Data Release', summary: '3月 CPI 通胀数据', impactLevel: 'High' },
  { date: '2025-05-07', type: 'Meeting', summary: 'FOMC 利率决议', impactLevel: 'Medium' },
];