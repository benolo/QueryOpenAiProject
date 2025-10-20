import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Returns service health info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptimeSeconds:
 *                   type: number
 *                 dependencies:
 *                   type: object
 */
router.get('/', async (_req: Request, res: Response) => {
  const dependencies = {
    database: 'unknown',
    cache: 'unknown',
  };

  // Example: implement DB/cache checks here
  // try { await db.ping(); dependencies.database = 'ok'; } catch { dependencies.database = 'fail'; }

  res.json({
    status: 'ok',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    dependencies,
  });
});

export default router;
