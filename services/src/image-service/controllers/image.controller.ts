import { Request, Response } from "express";
import { analyzeImage } from "../services/image.service";

export const analyzeImageController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const result = await analyzeImage(req.file.buffer);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      error: "Image analysis failed",
      details: error.message || error
    });
  }
};