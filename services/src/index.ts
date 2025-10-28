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

// Simple HTML Swagger UI endpoint
app.get('/api-docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Food Analysis API</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/swagger-spec',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `;
  res.send(html);
});

// Test endpoint to check swagger spec
app.get('/swagger-spec', (req, res) => {
  res.json(swaggerSpec);
});

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
