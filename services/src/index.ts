import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import logger from './logger';
import healthRouter from './query-service/routes/health';
import { queryRouter } from './query-service/routes/query.routes';
import imageRouter from './image-service/routes/image.route';

dotenv.config();

const app = express();
app.use(express.json());

// Test endpoint to check swagger spec
app.get('/swagger-spec', (req, res) => {
  res.json(swaggerSpec);
});

// Swagger UI configuration for Vercel
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Food Analysis API",
  swaggerOptions: {
    persistAuthorization: true,
    url: '/swagger-spec', // Explicitly point to our spec endpoint
    deepLinking: true,
    displayRequestDuration: true,
  }
}));

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Routes
app.use('/health', healthRouter);
app.use('/', queryRouter);
app.use('/', imageRouter);

// Vercel handler
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
