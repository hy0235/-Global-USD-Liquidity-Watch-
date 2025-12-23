import { SectionType, SubCategory, Indicator, FOMCEvent } from './types';

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

export const ONSHORE_INDICATORS: Indicator[] = [
  // --- General (核心流动性) ---
  {
    id: 'on-1', name: '财政部一般账户 (TGA)', nameEn: 'Treasury General Account', code: 'TGA',
    description: '财政部的“钱包”。当前处于 2025 年末高位，变动直接影响银行准备金。', descriptionEn: 'Treasury cash at Fed.',
    currentValue: 712.5, unit: '$B', change: 2.1, lastUpdated: '2025-12-22', source: 'FRED', sourceUrl: 'https://fred.stlouisfed.org/series/WTREGEN',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.GENERAL, weight: 9, history: generateHistory(700, 15),
  },
  {
    id: 'on-2', name: '美联储总资产 (WALCL)', nameEn: 'Fed Total Assets', code: 'WALCL',
    description: '反映美联储资产负债表规模。2025 年缩表（QT）已接近尾声。', descriptionEn: 'QT progress.',
    currentValue: 6720, unit: '$B', change: -0.8, lastUpdated: '2025-12-18', source: 'FRED', sourceUrl: 'https://fred.stlouisfed.org/series/WALCL',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.GENERAL, weight: 8, history: generateHistory(6800, 20),
  },
  {
    id: 'on-3', name: '银行准备金 (Reserves)', nameEn: 'Bank Reserves', code: 'Reserves',
    description: '银行系统最核心流动性。随着 2025 年三次降息，目前维持在 3.1 万亿水平。', descriptionEn: 'Core bank liquidity.',
    currentValue: 3150, unit: '$B', change: -1.5, lastUpdated: '2025-12-18', source: 'Fed', sourceUrl: 'https://fred.stlouisfed.org/series/TOTRESNS',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.GENERAL, weight: 10, history: generateHistory(3200, 50),
  },
  // --- Repo Market (回购市场) ---
  {
    id: 'on-4', name: '隔夜逆回购 (ON RRP)', nameEn: 'Overnight RRP', code: 'ON RRP',
    description: '市场的闲钱蓄水池。2025 年末余额保持在低位，缓冲垫消耗殆尽。', descriptionEn: 'Liquidity buffer.',
    currentValue: 342.8, unit: '$B', change: -4.2, lastUpdated: '2025-12-22', source: 'NY Fed', sourceUrl: 'https://www.newyorkfed.org/markets/desk-operations/reverse-repo',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.REPO_MARKET, weight: 9, history: generateHistory(350, 10),
  },
  {
    id: 'on-5', name: 'SOFR 利率', nameEn: 'SOFR Rate', code: 'SOFR',
    description: '回购市场真实融资成本。随着 12 月降息，目前已跟随政策利率回落。', descriptionEn: 'Repo funding cost.',
    currentValue: 3.82, unit: '%', change: -0.25, lastUpdated: '2025-12-22', source: 'NY Fed', sourceUrl: 'https://www.newyorkfed.org/markets/reference-rates/sofr',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.REPO_MARKET, weight: 8, history: generateHistory(3.82, 0.05),
  },
  {
    id: 'on-6', name: '常备回购便利 (SRF)', nameEn: 'Standing Repo Facility', code: 'SRF',
    description: '美联储提供的“最后借钱窗口”。目前使用量为零，说明市场尚未发生极端钱荒。', descriptionEn: 'Fed liquidity backstop.',
    currentValue: 0.0, unit: '$B', change: 0, lastUpdated: '2025-12-22', source: 'NY Fed', sourceUrl: 'https://www.newyorkfed.org/markets/standing-repo-facility',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.REPO_MARKET, weight: 7, history: generateHistory(0, 0),
  },
  // --- Treasury Basis (美债基差) ---
  {
    id: 'on-7', name: '美债现货期货基差', nameEn: 'UST Basis', code: 'Basis',
    description: '基差套利空间。数值高位徘徊说明对冲基金杠杆依然处于高位。', descriptionEn: 'Basis trade leverage.',
    currentValue: 0.42, unit: 'bps', change: 0.05, lastUpdated: '2025-12-22', source: 'CME', sourceUrl: 'https://www.cmegroup.com/markets/interest-rates/us-treasury/us-treasury-basis.html',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.TREASURY_BASIS, weight: 7, history: generateHistory(0.40, 0.02),
  },
  {
    id: 'on-8', name: '杠杆基金美债净空头', nameEn: 'Lev Net Shorts', code: 'LevShorts',
    description: '对冲基金持有的美债空头。如果数值非常大，一旦市场反向，会发生挤兑。', descriptionEn: 'HF Treasury shorts.',
    currentValue: -750, unit: 'k', change: -2.0, lastUpdated: '2025-12-20', source: 'CFTC', sourceUrl: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
    category: SectionType.ONSHORE_LIQUIDITY, subCategory: SubCategory.TREASURY_BASIS, weight: 9, history: generateHistory(-740, 15),
  }
];

export const OFFSHORE_INDICATORS: Indicator[] = [
  // --- JPY Market (日元市场) ---
  {
    id: 'off-1', name: 'USD/JPY 汇率', nameEn: 'USD/JPY FX', code: 'USDJPY',
    currentValue: 142.50, unit: '¥', change: -1.5, lastUpdated: '2025-12-23', source: 'FX', sourceUrl: 'https://finance.yahoo.com/quote/USDJPY=X/',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.JPY_MARKET, weight: 9, history: generateHistory(145, 2), description: '日元走势是全球套息交易的“总开关”。', descriptionEn: 'Carry trade benchmark.'
  },
  {
    id: 'off-2', name: '10Y 日债收益率', nameEn: 'JGB 10Y Yield', code: 'JP10Y',
    currentValue: 1.25, unit: '%', change: 0.05, lastUpdated: '2025-12-23', source: 'BoJ', sourceUrl: 'https://www.boj.or.jp/en/statistics/dl/jgbp/index.htm',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.JPY_MARKET, weight: 8, history: generateHistory(1.20, 0.05), description: '日债利率上行会吸引全球日元回流。', descriptionEn: 'JGB Yield.'
  },
  {
    id: 'off-3', name: '日本央行基准利率', nameEn: 'BoJ Rate', code: 'BoJRate',
    currentValue: 0.25, unit: '%', change: 0, lastUpdated: '2025-12-19', source: 'BoJ', sourceUrl: 'https://www.boj.or.jp/',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.JPY_MARKET, weight: 7, history: generateHistory(0.25, 0), description: '日央行货币政策正常化决定了日元资金的价格。', descriptionEn: 'BoJ Target Rate.'
  },
  // --- Cross-Currency Basis (货币互换) ---
  {
    id: 'off-4', name: 'JPY/USD 3M 互换基差', nameEn: 'JPY/USD Basis', code: 'JPYCBS',
    currentValue: -22.5, unit: 'bps', change: -1.2, lastUpdated: '2025-12-23', source: 'Reuters', sourceUrl: 'https://reuters.com',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.XCCY_BASIS, weight: 10, history: generateHistory(-25, 2), description: '反映离岸日元换取美元的成本。负值越大，美元越贵。', descriptionEn: 'JPY-USD funding cost.'
  },
  {
    id: 'off-5', name: 'EUR/USD 3M 互换基差', nameEn: 'EUR/USD Basis', code: 'EURCBS',
    currentValue: -12.8, unit: 'bps', change: -0.4, lastUpdated: '2025-12-23', source: 'Reuters', sourceUrl: 'https://reuters.com',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.XCCY_BASIS, weight: 8, history: generateHistory(-15, 1), description: '离岸欧元换取美元的额外成本。', descriptionEn: 'EUR-USD funding cost.'
  },
  // --- Euro Market (欧元/离岸市场) ---
  {
    id: 'off-6', name: '全球非银美元信贷 (BIS)', nameEn: 'Global USD Credit', code: 'BISCredit',
    currentValue: 14.5, unit: '$T', change: 0.3, lastUpdated: '季度', source: 'BIS', sourceUrl: 'https://www.bis.org/statistics/totcredit.htm',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.EURO_MARKET, weight: 7, history: generateHistory(14.0, 0.1), description: '离岸美元信用总额，2025年保持稳健。', descriptionEn: 'Offshore USD Credit.'
  },
  {
    id: 'off-7', name: 'TED Spread', nameEn: 'TED Spread', code: 'TED',
    currentValue: 18.5, unit: 'bps', change: -1.1, lastUpdated: '2025-12-22', source: 'FRED', sourceUrl: 'https://fred.stlouisfed.org/series/TEDRATE',
    category: SectionType.OFFSHORE_LIQUIDITY, subCategory: SubCategory.EURO_MARKET, weight: 6, history: generateHistory(20, 2), description: '信用风险溢价。目前处于健康低位。', descriptionEn: 'Interbank credit risk.'
  }
];

export const FED_INDICATORS: Indicator[] = [
  {
    id: 'fed-1', name: '有效联邦基金利率 (EFFR)', nameEn: 'Effective Fed Funds Rate', code: 'EFFR',
    currentValue: 3.64, unit: '%', change: -0.25, lastUpdated: '2025-12-19', source: 'NY Fed', sourceUrl: 'https://fred.stlouisfed.org/graph/?g=qYzm',
    category: SectionType.FED_POLICY, subCategory: SubCategory.FED_RATES, weight: 10, history: generateHistory(3.64, 0.05), 
    description: '最新 EFFR 为 3.64%。美联储在 2025 年 9、10、12 月连续三次降息 25bp，目前目标区间为 3.50%–3.75%。', 
    descriptionEn: 'Updated Dec 2025. Target range: 3.50%–3.75% after Dec cut.'
  },
  {
    id: 'fed-2', name: '2026 中性利率预期', nameEn: '2026 Neutral Rate', code: 'SEP2026',
    currentValue: 3.4, unit: '%', change: 0, lastUpdated: '2025-12-10', source: 'Fed', sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
    category: SectionType.FED_POLICY, subCategory: SubCategory.FED_DOTS, weight: 9, history: generateHistory(3.4, 0.1), description: '美联储 12 月 SEP 点阵图预计降息周期的理想“终点线”。', descriptionEn: 'Dot plot median projection for terminal rate.'
  }
];

export const FED_EVENTS: FOMCEvent[] = [
  { date: '2025-01-29', type: 'Meeting', summary: '按兵不动，维持利率 4.25%-4.50%。', summaryEn: 'Hold.', impactLevel: 'Medium' },
  { date: '2025-03-19', type: 'Meeting', summary: '维持利率不变，发布年度首份 SEP。', summaryEn: 'Hold & SEP.', impactLevel: 'Medium' },
  { date: '2025-06-18', type: 'Meeting', summary: '维持利率，暗示通胀风险受控。', summaryEn: 'Hold & Dovish Tilt.', impactLevel: 'Medium' },
  { date: '2025-09-17', type: 'Meeting', summary: '首降 25bps！区间降至 4.00%-4.25%。', summaryEn: '1st Cut: -25bps.', impactLevel: 'High' },
  { date: '2025-10-29', type: 'Meeting', summary: '连降 25bps！区间降至 3.75%-4.00%。', summaryEn: '2nd Cut: -25bps.', impactLevel: 'High' },
  { date: '2025-12-10', type: 'Meeting', summary: '收官战：三连降 25bps！区间降至 3.50%-3.75%。', summaryEn: '3rd Cut: -25bps.', impactLevel: 'High' },
  { date: '2026-01-28', type: 'Meeting', summary: '展望：评估 2025 三连降后的经济反馈。', summaryEn: 'Jan 2026 Opener.', impactLevel: 'High' },
  { date: '2026-03-18', type: 'Meeting', summary: '3月 SEP：确认 2026 年底是否达到中性利率。', summaryEn: 'Mar 2026 SEP.', impactLevel: 'High' },
  { date: '2026-06-17', type: 'Meeting', summary: '政策平稳期评估。', summaryEn: 'Jun 2026.', impactLevel: 'Medium' },
  { date: '2026-09-23', type: 'Meeting', summary: '决定是否进一步触及 3.0% 终点。', summaryEn: 'Sep 2026 Meeting.', impactLevel: 'High' }
];