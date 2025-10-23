import { analyzeFoodImage } from "../../ai.service";

export const analyzeImage = async (imageBuffer: Buffer) => {
  try {
    const base64Image = imageBuffer.toString("base64");
    const analysis = await analyzeFoodImage(base64Image);
    return analysis;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};