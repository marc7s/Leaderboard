import * as path from 'path';

// The Backend folder. Relative database paths are resolved from here, so the
// app, the Prisma CLI and scripts all use the same file wherever they run from.
const backendRoot = path.resolve(__dirname, '..', '..');

/**
 * The SQLite database URL from DATABASE_URL, with relative paths made absolute.
 * Defaults to `data/leaderboard.db` in the Backend folder.
 */
export function databaseUrl(): string {
  const url = process.env.DATABASE_URL || 'file:./data/leaderboard.db';
  if (!url.startsWith('file:')) return url;

  const file = url.slice('file:'.length);
  return 'file:' + path.resolve(backendRoot, file);
}
