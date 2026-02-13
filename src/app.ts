import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './shared/middlewares/errorHandler';
import { requestLogger, errorLogger } from './shared/middlewares/logger';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Servir arquivos estáticos de uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Logger de requisições (antes das rotas)
app.use(requestLogger);

app.use(routes);

// Logger de erros (antes do error handler)
app.use(errorLogger);

// Middleware global de tratamento de erros
app.use(errorHandler);

