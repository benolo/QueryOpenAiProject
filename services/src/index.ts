import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import logger from './logger';
import healthRouter from './query-service/routes/health';
import { queryRouter } from './query-service/routes/query.routes';

dotenv.config();

const app = express();
app.use(express.json());

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Routes
app.use('/health', healthRouter);
// app.use('/query', queryRouter);
app.use('/', queryRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} - env=${process.env.NODE_ENV || 'development'}`);
});
