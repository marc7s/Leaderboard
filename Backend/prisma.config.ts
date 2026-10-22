import * as dotenv from 'dotenv';
import * as path from 'path';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

// Same rule as src/db/databaseUrl.ts: relative SQLite paths are relative to the Backend folder.
// Kept separate so this file works before the rest of the code is copied (e.g. in Docker builds).
const url = process.env.DATABASE_URL || 'file:./data/leaderboard.db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: url.startsWith('file:') ? 'file:' + path.resolve(__dirname, url.slice('file:'.length)) : url,
  },
});
