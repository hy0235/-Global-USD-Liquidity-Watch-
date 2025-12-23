export type Language = 'zh' | 'en';

export enum SectionType {
  DASHBOARD = 'DASHBOARD',
  ONSHORE_LIQUIDITY = 'ONSHORE_LIQUIDITY',
  OFFSHORE_LIQUIDITY = 'OFFSHORE_LIQUIDITY',
  FED_POLICY = 'FED_POLICY'
}

export enum SubCategory {
  GENERAL = 'GENERAL',              // 核心流动性 (General)
  REPO_MARKET = 'REPO_MARKET',      // 回购市场 (Repo Market)
  TREASURY_BASIS = 'TREASURY_BASIS', // 美债基差 (Treasury Basis)
  XCCY_BASIS = 'XCCY_BASIS',       // 货币互换 (Cross-Currency Basis)
  JPY_MARKET = 'JPY_MARKET',       // 日元市场 (JPY Market)
  EURO_MARKET = 'EURO_MARKET',      // 欧元/离岸市场 (Euro Market)
  FED_RATES = 'FED_RATES',
  FED_DOTS = 'FED_DOTS'
}

export interface DataPoint {
  date: string;
  value: number;
  value2?: number;
}

export interface Indicator {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  description: string;
  descriptionEn: string;
  currentValue: number | string;
  unit: string;
  change: number;
  lastUpdated: string;
  source: string;
  sourceUrl: string;
  category: SectionType;
  subCategory: SubCategory;
  weight: number;
  history: DataPoint[];
}

export interface FOMCEvent {
  date: string;
  type: 'Meeting' | 'Minutes' | 'Speech' | 'Data Release';
  summary: string;
  summaryEn: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  speaker?: string;
  sourceUrl?: string;
}