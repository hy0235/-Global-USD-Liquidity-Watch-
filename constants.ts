
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
    for (let i = count; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        let value = targetYear === '2025' ? 3.4 : 2.9;
        value += (Math.random() - 0.5) * 0.1;
        data.push({ date: d.toISOString().split('T')[0], value: Number(value.toFixed(2)) });
    }
    return data;
}

// ==========================================
// 1. ONSHORE USD LIQUIDITY (在岸美元流动性 - 完整恢复)
// ==========================================

export const ONSHORE_INDICATORS: Indicator[] = [
  // --- General Onshore ---
  {
    id: 'on-1',
    name: '财政部一般账户 (TGA)',
    nameEn: 'Treasury General Account (TGA)',
    code: 'TGA',
    description: '2025年重点关注债务上限后的库容重建。TGA增加意味着从系统抽水。',
    descriptionEn: 'Monitoring TGA refill post-debt ceiling in 2025. Higher TGA drains system liquidity.',
    currentValue: 725.4, 
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
    name: '美联储总资产 (WALCL)',
    nameEn: 'Fed Total Assets',
    code: 'WALCL',
    description: 'QT进度。2025年末预计讨论停止缩表，2026年可能进入被动增长期。',
    descriptionEn: 'QT Progress. Taper discussion expected late 2025, potential passive growth in 2026.',
    currentValue: 6750, 
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
  // --- Repo Market ---
  {
    id: 'repo-1',
    name: '隔夜逆回购 (ON RRP)',
    nameEn: 'Overnight RRP',
    code: 'ON RRP',
    description: '流动性缓冲垫。2025年若余额触底，流动性压力将更直接体现在准备金上。',
    descriptionEn: 'Liquidity buffer. If balances hit floor in 2025, stress will shift directly to bank reserves.',
    currentValue: 315.2, 
    unit: '$B',
    change: -5.4,
    lastUpdated: '每日',
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
    nameEn: 'SOFR',
    code: 'SOFR',
    description: '回购基准利率。2025-2026年关注由于担保品分布不均导致的利率跳升风险。',
    descriptionEn: 'Repo benchmark. Watching for potential rate spikes in 2025-2026 due to collateral imbalances.',
    currentValue: 4.30,
    unit: '%',
    change: 0.00,
    lastUpdated: '每日',
    source: 'NY Fed',
    sourceUrl: 'https://www.newyorkfed.org/markets/reference-rates/sofr',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.REPO_MARKET,
    weight: 7,
    history: generatePolicyRateHistory(4.30), 
  },
  {
    id: 'repo-3',
    name: '有效联邦基金利率 (EFFR)',
    nameEn: 'Effective Fed Funds Rate',
    code: 'EFFR',
    description: '银行间无担保借贷利率。2026年预计锚定在3.25%-3.50%的中性区间。',
    descriptionEn: 'Unsecured interbank rate. Expected to anchor in 3.25%-3.50% neutral zone in 2026.',
    currentValue: 4.33,
    unit: '%',
    change: 0,
    lastUpdated: '每日',
    source: 'NY Fed',
    // Added missing sourceUrl
    sourceUrl: 'https://www.newyorkfed.org/markets/reference-rates/effr',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.REPO_MARKET,
    weight: 6,
    history: generatePolicyRateHistory(4.33),
  },
  // --- Basis Trade ---
  {
    id: 'basis-1',
    name: '现货期货基差 (Basis)',
    nameEn: 'Cash-Futures Basis',
    code: 'UST Basis',
    description: '衡量基差交易热度。2025年杠杆率处于高位，需警惕融资环境收紧引发的平仓。',
    descriptionEn: 'Basis trade crowding metric. High leverage in 2025 warrants caution against funding tighten-ups.',
    currentValue: 0.38,
    unit: 'bps',
    change: -0.02,
    lastUpdated: '实时',
    source: 'CME',
    // Added missing sourceUrl
    sourceUrl: 'https://www.cmegroup.com/markets/interest-rates/us-treasury/us-treasury-basis.html',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.TREASURY_BASIS,
    weight: 8,
    history: generateHistory(0.40, 0.05),
  },
  {
    id: 'basis-2',
    name: '杠杆基金美债净空头',
    nameEn: 'Lev Funds Net Shorts',
    code: 'Lev Net Shorts',
    description: '期货持仓数据。极端空头代表2025年基差交易极度拥挤，2026年可能面临重新定价。',
    descriptionEn: 'CFTC data. Extreme shorts show 2025 crowding, potential re-pricing in 2026.',
    currentValue: -750, 
    unit: 'k contracts',
    change: -15,
    lastUpdated: '周五',
    source: 'CFTC',
    // Added missing sourceUrl
    sourceUrl: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.TREASURY_BASIS,
    weight: 9,
    history: generateHistory(-740, 20),
  },
  // --- X-Ccy Basis ---
  {
    id: 'xccy-1',
    name: 'EUR/USD 3M 互换基差',
    nameEn: 'EUR/USD 3M Basis',
    code: 'EURCBS 3M',
    description: '欧元区获取美元的成本。2025年负值扩大代表欧洲美元市场趋紧。',
    descriptionEn: 'USD funding cost for Eurozone. Widening negative spread signals tightening in 2025.',
    currentValue: -14.2,
    unit: 'bps',
    change: -0.5,
    lastUpdated: '实时',
    source: 'Investing.com',
    // Added missing sourceUrl
    sourceUrl: 'https://www.investing.com/currencies/eur-usd-forward-rates',
    category: SectionType.ONSHORE_LIQUIDITY,
    subCategory: SubCategory.XCCY_BASIS,
    weight: 7,
    history: generateHistory(-13, 0.8),
  },
];

// ==========================================
// 2. OFFSHORE USD LIQUIDITY (离岸美元流动性 - 完整恢复)
// ==========================================

export const OFFSHORE_INDICATORS: Indicator[] = [
  {
    id: 'jp-1',
    name: '美元/日元 (USD/JPY)',
    nameEn: 'USD/JPY',
    code: 'USDJPY',
    description: '2025年由于日美利差收窄，套息交易平仓风险显著。2026年关注日元回归。',
    descriptionEn: 'Carry trade unwind risk in 2025 as spreads narrow. Focus on JPY recovery in 2026.',
    currentValue: 142.50,
    unit: '¥',
    change: 0.3,
    lastUpdated: '实时',
    source: 'Yahoo Finance',
    // Added missing sourceUrl
    sourceUrl: 'https://finance.yahoo.com/quote/USDJPY=X/',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO,
    weight: 10,
    history: generateHistory(141, 1.2),
  },
  {
    id: 'jp-2',
    name: '10年期日本国债收益率',
    nameEn: 'JGB 10Y Yield',
    code: 'JP10Y',
    description: '2025年若上破1.5%，将引发日本资金从美债市场撤回。',
    descriptionEn: 'Break above 1.5% in 2025 could trigger JPY repatriation from US Treasury markets.',
    currentValue: 1.15,
    unit: '%',
    change: 0.02,
    lastUpdated: '实时',
    source: 'BoJ',
    // Added missing sourceUrl
    sourceUrl: 'https://www.boj.or.jp/en/statistics/dl/jgbp/index.htm',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO,
    weight: 8,
    history: generateHistory(1.10, 0.03),
  },
  {
    id: 'jp-3',
    name: '日本央行政策利率',
    nameEn: 'BoJ Policy Rate',
    code: 'BOJ Rate',
    description: '2025年预计多次加息。2026年目标利率可能达到1.0%左右。',
    descriptionEn: 'Multiple hikes expected in 2025. Target rate could reach ~1.0% by 2026.',
    currentValue: 0.50,
    unit: '%',
    change: 0,
    lastUpdated: '会议',
    source: 'BoJ',
    // Added missing sourceUrl
    sourceUrl: 'https://www.boj.or.jp/en/mopo/mpmsche_minu/index.htm',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.JPY_MACRO,
    weight: 7,
    history: generateRealisticDotPlotHistory('2026', 120).map(i => ({...i, value: 0.5})),
  },
  {
    id: 'eu-1',
    name: '全球美元信贷 (BIS)',
    nameEn: 'Global Dollar Credit',
    code: 'BIS Credit',
    description: '离岸美元信用总量。2026年全球制造业复苏可能带动信用扩张。',
    descriptionEn: 'Total offshore USD credit. Global recovery in 2026 might drive credit expansion.',
    currentValue: 13.8,
    unit: '$Tril',
    change: 0.1,
    lastUpdated: '季更',
    source: 'BIS',
    // Added missing sourceUrl
    sourceUrl: 'https://www.bis.org/statistics/totcredit.htm',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.EURO_MARKET,
    weight: 8,
    history: generateHistory(13.6, 0.05),
  },
  {
    id: 'eu-2',
    name: '外国官方美债托管额',
    nameEn: 'Fed Custody Holdings',
    code: 'Fed Custody',
    description: '外储干预风向标。2025年减少意味着非美央行在抛售美债支撑本币。',
    descriptionEn: 'FX intervention proxy. Drops in 2025 suggest central banks selling USTs to support FX.',
    currentValue: 3.42, 
    unit: '$Tril',
    change: -0.01,
    lastUpdated: '周更',
    source: 'FRED',
    // Added missing sourceUrl
    sourceUrl: 'https://fred.stlouisfed.org/series/WFACTCL',
    category: SectionType.OFFSHORE_LIQUIDITY,
    subCategory: SubCategory.EURO_MARKET,
    weight: 6,
    history: generateHistory(3.45, 0.02),
  },
];

// ==========================================
// 3. FED POLICY (美联储政策 - 完整恢复)
// ==========================================

export const FED_INDICATORS: Indicator[] = [
  {
    id: 'fed-1',
    name: '联邦基金利率目标 (FFR)',
    nameEn: 'Fed Funds Rate Target',
    code: 'FFR',
    description: '2025年降息周期的焦点。2026年关注是否在3.5%附近企稳。',
    descriptionEn: 'Pivot focus in 2025. Watching for stabilization around 3.5% in 2026.',
    currentValue: 4.50,
    unit: '%',
    change: 0,
    lastUpdated: 'FOMC',
    source: 'Federal Reserve',
    // Added missing sourceUrl
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/openmarket.htm',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_RATES,
    weight: 10,
    history: generatePolicyRateHistory(4.50),
  },
  {
    id: 'fed-2',
    name: '点阵图 2026 预测',
    nameEn: 'SEP 2026 Projections',
    code: 'SEP 2026',
    description: 'FOMC委员对2026年底利率的中位数预期。反映中性利率看法。',
    descriptionEn: 'Median expectation for end-2026. Reflects views on Neutral Rate.',
    currentValue: 3.4,
    unit: '%',
    change: 0,
    lastUpdated: '12月',
    source: 'Fed',
    // Added missing sourceUrl
    sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_DOTS,
    weight: 9,
    history: generateRealisticDotPlotHistory('2026'),
  },
  {
    id: 'fed-3',
    name: '核心 PCE (YoY)',
    nameEn: 'Core PCE (YoY)',
    code: 'Core PCE',
    description: '2025年需关注是否能稳步降至2.0%目标。',
    descriptionEn: 'Monitoring move towards 2.0% target throughout 2025.',
    currentValue: 2.6,
    unit: '%',
    change: -0.1,
    lastUpdated: '月度',
    source: 'BEA',
    // Added missing sourceUrl
    sourceUrl: 'https://www.bea.gov/data/personal-consumption-expenditures-price-index',
    category: SectionType.FED_POLICY,
    subCategory: SubCategory.FED_RATES,
    weight: 8,
    history: generateHistory(2.7, 0.05),
  },
];

export const FED_EVENTS: FOMCEvent[] = [
  // --- 2025 关键日程 ---
  { date: '2025-05-07', type: 'Meeting', summary: '5月决议：关注是否暂停降息信号。', summaryEn: 'May Meeting: Watching for pause signals.', impactLevel: 'Medium' },
  { date: '2025-06-18', type: 'Meeting', summary: '6月决议 & 点阵图更新：2026年中性利率修正。', summaryEn: 'June Meeting & SEP: 2026 Neutral rate revision.', impactLevel: 'High' },
  { date: '2025-08-21', type: 'Speech', summary: '杰克逊霍尔：鲍威尔论述“后降息时代”框架。', summaryEn: 'Jackson Hole: Powell on "Post-Easing Era" framework.', impactLevel: 'High', speaker: 'Powell' },
  { date: '2025-09-17', type: 'Meeting', summary: '9月决议：确认QT缩表停止的时间表。', summaryEn: 'Sept Meeting: Confirming QT tapering schedule.', impactLevel: 'High' },
  { date: '2025-12-10', type: 'Meeting', summary: '2025收官会议：正式给出2026年通胀达标预判。', summaryEn: 'Year-end Meeting: 2026 inflation outlook confirmation.', impactLevel: 'High' },
  
  // --- 2026 展望节点 ---
  { date: '2026-01-28', type: 'Meeting', summary: '2026首场决议：设定全年流动性管理基调。', summaryEn: '2026 First Meeting: Setting liquidity management tone.', impactLevel: 'High' },
  { date: '2026-03-18', type: 'Meeting', summary: '评估降息对实体经济的滞后效应。', summaryEn: 'Assessing lag effects of cuts on real economy.', impactLevel: 'Medium' },
  { date: '2026-06-17', type: 'Minutes', summary: '发布2026中期经济展望纪要。', summaryEn: 'Mid-2026 Economic Outlook Minutes.', impactLevel: 'Low' },
];
