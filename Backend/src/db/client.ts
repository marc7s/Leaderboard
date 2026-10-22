import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { databaseUrl } from './databaseUrl';

/** The shared database client. Types for every table come from prisma/schema.prisma. */
export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl() }),
});
