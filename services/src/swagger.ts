import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Query Service API',
      version: '1.0.0',
      description: 'API documentation for the Query Service',
    },
  },
  // Adjust the path below to match where your route/controller files are
  apis: [path.join(__dirname, './query-service/routes/*.ts'), path.join(__dirname, './image-service/routes/*.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;