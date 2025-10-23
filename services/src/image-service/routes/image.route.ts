import express from "express";
import multer from "multer";
import { analyzeImageController } from "../controllers/image.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /image:
 *   post:
 *     summary: Analyze food image for nutrition information
 *     description: Uploads an image and analyzes it to extract nutrition information including ingredients, calories, and macronutrients.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Food image file (JPEG, PNG, etc.)
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Successful analysis with nutrition data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "chicken breast"
 *                       calories:
 *                         type: number
 *                         example: 165
 *                       carbs:
 *                         type: number
 *                         example: 0
 *                       protein:
 *                         type: number
 *                         example: 31
 *                       fat:
 *                         type: number
 *                         example: 3.6
 *                       quantity_grams:
 *                         type: number
 *                         example: 100
 *       400:
 *         description: Bad request - missing or invalid image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No image file provided"
 *       500:
 *         description: Internal server error during analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to analyze image"
 */
router.post("/image", upload.single("image"), analyzeImageController);

export default router;