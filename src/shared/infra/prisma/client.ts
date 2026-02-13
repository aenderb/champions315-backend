// Prisma client
import { PrismaClient } from '../../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'dev' ? ['query', 'error', 'warn'] : ['error'],
});