export enum SectionType {
  DASHBOARD = 'DASHBOARD',
  ONSHORE_LIQUIDITY = 'ONSHORE_LIQUIDITY',
  OFFSHORE_LIQUIDITY = 'OFFSHORE_LIQUIDITY',
  FED_POLICY = 'FED_POLICY'
}

export enum SubCategory {
  // Onshore
  GENERAL_ONSHORE = '核心流动性 (General)',
  REPO_MARKET = '回购市场 (Repo Market)',
  TREASURY_BASIS = '美债基差 (Treasury Basis Trade)',
  XCCY_BASIS = '货币互换 (Cross-Currency Basis)',
  
  // Offshore
  JPY_MACRO = '日元宏观 (JPY Macro)',
  EURO_MARKET = '欧元市场 (Euro Market)',
  
  // Fed
  FED_RATES = '利率与通胀',
  FED_DOTS = '点阵图预测'
}

export interface DataPoint {
  date: string;
  value: number;
  value2?: number; // For comparison
}

export interface Indicator {
  id: string;
  name: string;
  code: string; // e.g., 'TGA', 'SOFR'
  description: string;
  currentValue: number | string;
  unit: string;
  change: number; // Percentage change
  lastUpdated: string;
  source: string; // Official data source authority
  sourceUrl: string; // Direct link to official data
  category: SectionType;
  subCategory: SubCategory;
  weight: number; // 1-10, determines bubble size
  history: DataPoint[];
  correlationNote?: string; // Relationship explanation
}

export interface FOMCEvent {
  date: string;
  type: 'Meeting' | 'Minutes' | 'Speech' | 'Data Release';
  summary: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  speaker?: string; // For speeches
}

export interface AdminConfig {
  isAdminMode: boolean;
  customModules: Array<{ id: string; name: string }>;
}