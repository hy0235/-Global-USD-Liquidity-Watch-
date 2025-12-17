
export type Language = 'zh' | 'en';

export enum SectionType {
  DASHBOARD = 'DASHBOARD',
  ONSHORE_LIQUIDITY = 'ONSHORE_LIQUIDITY',
  OFFSHORE_LIQUIDITY = 'OFFSHORE_LIQUIDITY',
  FED_POLICY = 'FED_POLICY'
}

export enum SubCategory {
  // Onshore
  GENERAL_ONSHORE = 'GENERAL_ONSHORE',
  REPO_MARKET = 'REPO_MARKET',
  TREASURY_BASIS = 'TREASURY_BASIS',
  XCCY_BASIS = 'XCCY_BASIS',
  
  // Offshore
  JPY_MACRO = 'JPY_MACRO',
  EURO_MARKET = 'EURO_MARKET',
  
  // Fed
  FED_RATES = 'FED_RATES',
  FED_DOTS = 'FED_DOTS'
}

export interface DataPoint {
  date: string;
  value: number;
  value2?: number; // For comparison
}

export interface Indicator {
  id: string;
  name: string;
  nameEn: string; // English Name
  code: string; // e.g., 'TGA', 'SOFR'
  description: string;
  descriptionEn: string; // English Description
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
  correlationNoteEn?: string; // English Relationship explanation
}

export interface FOMCEvent {
  date: string;
  type: 'Meeting' | 'Minutes' | 'Speech' | 'Data Release';
  summary: string;
  summaryEn: string; // English Summary
  impactLevel: 'High' | 'Medium' | 'Low';
  speaker?: string; // For speeches
}

export interface AdminConfig {
  isAdminMode: boolean;
  customModules: Array<{ id: string; name: string }>;
}
