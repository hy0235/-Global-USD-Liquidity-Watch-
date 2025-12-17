
import { GoogleGenAI } from "@google/genai";
import { Indicator, Language } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLiquidityImpact = async (usIndicators: Indicator[], jpyIndicators: Indicator[], lang: Language = 'zh') => {
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
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'zh' ? "分析服务暂时不可用。" : "Analysis service unavailable.";
  }
};

export const analyzeSectionLiquidity = async (sectionName: string, indicators: Indicator[], lang: Language = 'zh') => {
  const ai = getAiClient();
  const dataSummary = indicators.map(i => {
      const name = lang === 'zh' ? i.name : i.nameEn;
      return `${name} (${i.code}): ${i.currentValue}${i.unit} (Change: ${i.change}%)`
  }).join('\n');

  const prompt = lang === 'zh' ? `
    对"${sectionName}"进行深度分析，特别是对 2025 年末到 2026 年初的政策传导。
    数据:
    ${dataSummary}
    请按以下格式输出：
    ### 1. 推理逻辑
    ### 2. 2025 现状判断
    ### 3. 2026 政策锚点与风险
  ` : `
    Deep analysis for "${sectionName}" focusing on policy transmission from late 2025 to early 2026.
    Data:
    ${dataSummary}
    Format:
    ### 1. Reasoning Logic
    ### 2. 2025 Status
    ### 3. 2026 Policy Anchors & Risks
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: lang === 'zh' ? "专业宏观交易员视角，关注未来两年周期" : "Professional macro trader perspective, focus on the next 2-year cycle"
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'zh' ? "AI 分析服务暂时不可用。" : "AI analysis unavailable.";
  }
};

/**
 * Fetches upcoming release dates for macro indicators using Google Search Grounding
 */
export const fetchIndicatorReleaseDates = async (lang: Language = 'zh') => {
  const ai = getAiClient();
  const query = lang === 'zh' 
    ? "搜索并列出 2025 年剩余月份和 2026 年初已知的美元宏观指标发布日程，特别是 FOMC 会议、PCE、非农以及 TGA 更新。请标注 2026 年的预估时间点。"
    : "Search and list key USD macro indicator release dates for the rest of 2025 and early 2026, including FOMC Meetings, PCE, NFP, and TGA updates. Highlight estimated 2026 dates.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    throw error;
  }
};
