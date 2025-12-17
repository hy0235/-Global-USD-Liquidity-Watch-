import { GoogleGenAI } from "@google/genai";
import { Indicator } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeLiquidityImpact = async (usIndicators: Indicator[], jpyIndicators: Indicator[]) => {
  if (!apiKey) return "未配置 API Key。";

  const usData = usIndicators.map(i => `${i.code}: ${i.currentValue}${i.unit}`).join(', ');
  const jpyData = jpyIndicators.map(i => `${i.code}: ${i.currentValue}${i.unit}`).join(', ');

  const prompt = `
    你是一位资深的宏观策略师。根据以下实时数据，用中文总结当前全球美元流动性的状态（请列出 3 个简明扼要的要点）。
    
    数据:
    美国指标: ${usData}
    日本指标: ${jpyData}
    
    请重点关注:
    1. 净流动性公式 (美联储资产负债表 - TGA - RRP) 的变化及其含义。
    2. 美元兑日元 (USDJPY) 套息交易对美国国债的潜在影响。
    3. 最终结论：当前流动性是在扩张、中性还是收缩？
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "分析服务暂时不可用。";
  }
};

export const analyzeSectionLiquidity = async (sectionName: string, indicators: Indicator[]) => {
  if (!apiKey) return "未配置 API Key。";

  const dataSummary = indicators.map(i => `${i.name} (${i.code}): ${i.currentValue}${i.unit} (变化: ${i.change}%)`).join('\n');

  const prompt = `
    作为一位资深的全球宏观交易员，请对"${sectionName}"板块进行深度流动性分析。
    
    实时指标数据:
    ${dataSummary}

    请严格按照以下 Markdown 格式输出分析结果：

    ### 1. 推理逻辑
    (简述核心指标之间的传导机制。例如：若TGA上升且RRP下降，说明财政部发债主要由货币基金承接，对银行准备金冲击较小。需结合数据变化数值进行逻辑推导。)

    ### 2. 当前状态
    (明确给出定性判断：**宽松** / **中性** / **紧缩** / **边际收紧** 等。并简述核心理由。)

    ### 3. 未来展望
    (基于当前数据趋势，预测未来 1-3 个月的流动性走向。关注潜在的风险点或拐点。)
    
    要求：专业、客观、逻辑严密，字数控制在 300 字以内。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 分析服务暂时不可用，请稍后再试。";
  }
};

export const explainCorrelation = async (metricA: string, metricB: string) => {
    if (!apiKey) return "未配置 API Key。";
    
    const prompt = `用中文解释 ${metricA} 和 ${metricB} 之间的宏观经济关系，一段话以内（50字左右）。重点解释因果机制。`;
    
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text;
      } catch (error) {
        return "暂无解释。";
      }
}