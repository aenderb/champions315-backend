# Guia de Migração de Logging

## Estrutura Atual
- **request.log** - Logs de requisições HTTP
- **error.log** - Logs de erros
- **combined.log** - Todos os logs

## Migração para Elasticsearch

### 1. Instalar dependência
```bash
npm install winston-elasticsearch
```

### 2. Atualizar `src/shared/config/logger.ts`
```typescript
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  },
  index: 'champions315-logs',
});

// Adicionar ao array transports
const transports: winston.transport[] = [
  esTransport, // Adicionar esta linha
  // ... outros transports
];
```

### 3. Atualizar variáveis de ambiente
```env
ELASTICSEARCH_URL=http://localhost:9200
LOG_LEVEL=info
```

## Migração para CloudWatch

### 1. Instalar dependência
```bash
npm install winston-cloudwatch
```

### 2. Atualizar logger
```typescript
import WinstonCloudWatch from 'winston-cloudwatch';

const cloudwatchTransport = new WinstonCloudWatch({
  logGroupName: 'champions315-api',
  logStreamName: 'production',
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
});
```

## Outras opções
- **Datadog**: `winston-datadog`
- **Loggly**: `winston-loggly-bulk`
- **Sentry**: `@sentry/node`
- **New Relic**: `newrelic`
