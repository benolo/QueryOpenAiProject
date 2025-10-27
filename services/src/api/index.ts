import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../swagger';
import logger from '../logger';
import healthRouter from '../query-service/routes/health';
import { queryRouter } from '../query-service/routes/query.routes';
import imageRouter from '../image-service/routes/image.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT} - env=${process.env.NODE_ENV || 'development'}`);
//   logger.info('To run Swagger use: http://localhost:3000/api-docs')
// });

export default app;
