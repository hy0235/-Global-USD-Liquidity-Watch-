
import { GoogleGenAI } from "@google/genai";

interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

export const generateDemoVideo = async (): Promise<string | null> => {
  const aistudio = (window as any).aistudio as AIStudio;
  
  // 显式断言 process 类型
  const getApiKey = (): string => {
    try {
      return (process.env as any).API_KEY || "";
    } catch (e) {
      return "";
    }
  };

  const ensureKey = async (forcePrompt = false) => {
    let hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey || forcePrompt) {
        await aistudio.openSelectKey();
        hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) throw new Error("API Key selection cancelled by user");
    }
  };

  const performGeneration = async () => {
    const key = getApiKey();
    const ai = new GoogleGenAI({ apiKey: key });

    const prompt = `
      A cinematic, high-tech product demo video of a financial web application named "Global USD Liquidity Watch".
      The screen displays a clean, white, Notion-style dashboard interface.
      In the center, there is a complex, interactive force-directed bubble graph with blue and purple nodes connecting to each other.
      Below the graph, there are professional line charts showing financial trends.
      The camera slowly pans across the dashboard, highlighting the data visualization.
      4k resolution, sharp focus, professional fintech aesthetic.
    `;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
        throw new Error(`Generation failed: ${JSON.stringify(operation.error)}`);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned from API");

    return `${videoUri}&key=${key}`;
  };

  try {
    await ensureKey();
    return await performGeneration();
  } catch (error: any) {
    const errorMsg = error.toString().toLowerCase();
    if (errorMsg.includes("requested entity was not found") || errorMsg.includes("404")) {
        try {
            await ensureKey(true);
            return await performGeneration();
        } catch (retryError) {
            console.error("Retry failed:", retryError);
            throw retryError;
        }
    }
    console.error("Veo Video Generation Error:", error);
    throw error;
  }
};
