
import { GoogleGenAI } from "@google/genai";
import { Indicator, Language } from "../types";

const getApiKey = (): string => {
  try {
    return (process.env as any).API_KEY || "";
  } catch (e) {
    return "";
  }
};

const getAiClient = () => new GoogleGenAI({ apiKey: getApiKey() });

// AI 实时抓取最新指标数据
export const fetchLiveIndicatorValue = async (indicator: Indicator, lang: Language = 'zh'): Promise<{ value: string; summary: string }> => {
  const ai = getAiClient();
  const query = lang === 'zh'
    ? `查询最新的金融市场数据：${indicator.nameEn} (${indicator.code}) 当前的最新数值、涨跌以及来源日期。请提供一个非常简洁的摘要。`
    : `Find the latest financial market data for ${indicator.nameEn} (${indicator.code}). Current value, change, and source date. Provide a concise summary.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a precise financial data terminal. Only provide the most recent and verified data points."
      }
    });

    const text = response.text || "";
    // 简单的解析逻辑，如果AI返回了明显的数值
    const valueMatch = text.match(/(\d+\.?\d*)\s*[%|¥|$|bps|B|Tril]?/);
    const value = valueMatch ? valueMatch[0] : (lang === 'zh' ? '见摘要' : 'See summary');

    return { value, summary: text };
  } catch (error) {
    console.error("Live fetch error:", error);
    return { value: 'N/A', summary: lang === 'zh' ? '搜索失败' : 'Search failed' };
  }
};

export const analyzeLiquidityImpact = async (usIndicators: Indicator[], jpyIndicators: Indicator[], lang: Language = 'zh'): Promise<string> => {
  const ai = getAiClient();
  const usData = usIndicators.map(i => `${i.code}: ${i.currentValue}${i.unit}`).join(', ');
  const jpyData = jpyIndicators.map(i => `${i.code}: ${i.currentValue}${i.unit}`).join(', ');

  const systemInstruction = lang === 'zh' 
    ? "你是一位精通 2025-2026 宏观周期的首席策略师。请关注中性利率 (Neutral Rate) 和 QT 终局。用中文回答。" 
    : "You are a Chief Strategist expert in the 2025-2026 macro cycle. Focus on the Neutral Rate and QT End-Game. Answer in English.";

  const prompt = lang === 'zh' ? `
    根据以下数据总结当前及 2025/2026 展望（3个要点）：
    美国数据: ${usData}
    日本数据: ${jpyData}
    重点：2025年降息终点、2026年中性利率预期、以及离岸日元套息平仓的风险。
  ` : `
    Summarize status and 2025/2026 outlook based on this data (3 points):
    US Data: ${usData}
    Japan Data: ${jpyData}
    Focus: 2025 terminal rate, 2026 neutral rate expectations, and JPY carry trade unwind risks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction }
    });
    return response.text || "No response";
  } catch (error) {
    return "Analysis service unavailable.";
  }
};

export const analyzeSectionLiquidity = async (sectionName: string, indicators: Indicator[], lang: Language = 'zh'): Promise<string> => {
  const ai = getAiClient();
  const dataSummary = indicators.map(i => `${lang === 'zh' ? i.name : i.nameEn}: ${i.currentValue}${i.unit}`).join('\n');

  const prompt = `
    Analyze: ${sectionName}
    Current Data:
    ${dataSummary}
    Focus on 2025-2026 cycle implications.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: lang === 'zh' ? "专业宏观交易员视角" : "Macro trader perspective"
      }
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};

export const fetchIndicatorReleaseDates = async (lang: Language = 'zh'): Promise<{ text: string, sources: any[] }> => {
  const ai = getAiClient();
  const query = lang === 'zh' 
    ? "搜索 2025 年和 2026 年初最新的宏观指标发布时间表。包括 FOMC 会议、非农、PCE、CPI 以及 TGA 更新。"
    : "Search for the latest 2025 and early 2026 macro indicator release schedules including FOMC, NFP, PCE, CPI, and TGA updates.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { 
      text: response.text || "", 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    return { text: "Search error", sources: [] };
  }
};
