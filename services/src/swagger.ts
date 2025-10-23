import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservice API',
      version: '1.0.0',
      description: 'Auto-generated Swagger documentation for this microservice',
    },
  },
  // apis: ['./query-service/routes/*.ts']
  apis: [path.join(__dirname, './query-service/routes/*.ts'), path.join(__dirname, './image-service/routes/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
