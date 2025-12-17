import { GoogleGenAI } from "@google/genai";

// Define a local interface for the AIStudio helper to avoid global namespace collisions
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

export const generateDemoVideo = async (): Promise<string | null> => {
  // Access window.aistudio safely
  const aistudio = (window as any).aistudio as AIStudio;

  // Helper: Ensure we have a valid key, optionally forcing re-selection
  const ensureKey = async (forcePrompt = false) => {
    let hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey || forcePrompt) {
        await aistudio.openSelectKey();
        hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) throw new Error("API Key selection cancelled by user");
    }
  };

  // Helper: Perform the actual generation sequence
  const performGeneration = async () => {
    // Initialize AI with the environment key (injected after selection)
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      A cinematic, high-tech product demo video of a financial web application named "Global USD Liquidity Watch".
      The screen displays a clean, white, Notion-style dashboard interface.
      In the center, there is a complex, interactive force-directed bubble graph with blue and purple nodes connecting to each other.
      Below the graph, there are professional line charts showing financial trends.
      The camera slowly pans across the dashboard, highlighting the data visualization.
      4k resolution, sharp focus, professional fintech aesthetic.
    `;

    console.log("Starting Veo video generation...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    console.log("Video operation started:", operation);

    // Polling loop with 10s interval as recommended for Video models
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Polling status:", operation.metadata?.state);
    }

    if (operation.error) {
        throw new Error(`Generation failed: ${JSON.stringify(operation.error)}`);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned from API");

    // Append key for download access
    return `${videoUri}&key=${process.env.API_KEY}`;
  };

  try {
    // 1. First attempt
    await ensureKey();
    return await performGeneration();
  } catch (error: any) {
    const errorMsg = error.toString().toLowerCase();
    
    // 2. Retry Logic: Handle "Requested entity was not found" specifically
    // This error often means the selected project/key state is stale or invalid in the current context.
    if (errorMsg.includes("requested entity was not found") || errorMsg.includes("404")) {
        console.warn("API Key entity not found. Retrying selection and generation...");
        try {
            await ensureKey(true); // Force open the key selection dialog again
            return await performGeneration(); // Retry the generation logic
        } catch (retryError) {
            console.error("Retry failed:", retryError);
            throw retryError;
        }
    }
    
    console.error("Veo Video Generation Error:", error);
    throw error;
  }
};