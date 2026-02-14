import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { swaggerSpec } from './shared/config/swagger';
import { env } from './env';
import { errorHandler } from './shared/middlewares/errorHandler';
import { requestLogger, errorLogger } from './shared/middlewares/logger';

export const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
}));

// Render pode usar proxy reverso — necessário para cookies secure funcionarem
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

// Imagens servidas pelo Cloudinary — não precisa mais de static serve local

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON (para importar no Insomnia/Postman)
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Logger de requisições (antes das rotas)
app.use(requestLogger);

app.use('/api', routes);

// Logger de erros (antes do error handler)
app.use(errorLogger);

// Middleware global de tratamento de erros
app.use(errorHandler);

