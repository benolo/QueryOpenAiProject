import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Analysis API',
      version: '1.0.0',
      description: 'API documentation for Food Analysis Service with OpenAI and LangSmith integration',
    },
    servers: [
      {
        url: 'https://query-open-ai-project-vercel.vercel.app',
        description: 'Production server',
      },
    ],
  },
  // Adjust the path below to match where your route/controller files are
  apis: [
    path.join(__dirname, './query-service/routes/*.js'), 
    path.join(__dirname, './image-service/routes/*.js'),
    path.join(__dirname, './query-service/routes/*.ts'), 
    path.join(__dirname, './image-service/routes/*.ts')
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

// Debug logging
console.log('Swagger spec generated:', Object.keys(swaggerSpec));
console.log('Swagger paths:', (swaggerSpec as any).paths ? Object.keys((swaggerSpec as any).paths) : 'No paths found');

export default swaggerSpec;