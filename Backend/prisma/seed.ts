// Fills a new, empty database. Run with `npm run db:seed` after `npm run db:deploy`.
//
// - Always adds the reference data: games, cars, weathers, tyres, countries, tracks, default
//   setups and real-world Formula 1 lap times (seed-data/reference.json).
// - Always adds the users, configs and lap times from an older backup of the leaderboard
//   (seed-data/backup.json). It is not up to date with the live database.
// - ADMIN_USERNAME and ADMIN_PASSWORD create an admin who can log in, or make an existing
//   user with that name an admin. This part also runs on a database that is already seeded.
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env', quiet: true });

import { prisma } from '../src/db/client';
import { hashPassword } from '../src/db/password';
import reference from './seed-data/reference.json';
import backup from './seed-data/backup.json';

type SeedData = Partial<Record<(typeof tables)[number], object[]>>;

// In the order they must be inserted, so that rows exist before others refer to them
const tables = [
  'user', 'game', 'car', 'weather', 'tyre', 'country', 'track', 'setup', 'config', 'time',
  'authenticClass', 'authenticDriver', 'authenticTeam', 'authenticSeason', 'authenticTime',
] as const;

async function insert(data: SeedData) {
  for (const table of tables) {
    const rows = data[table];
    if (rows?.length) await (prisma[table] as any).createMany({ data: rows });
  }
}

async function main() {
  if ((await prisma.country.count()) > 0) {
    console.log('The database already has data, so no seed data was added.');
  } else {
    await insert(reference as SeedData);
    await insert(backup as SeedData);
    console.log('Added reference data and the lap times from the backup.');
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    const data = { admin: true, password: new Uint8Array(hashPassword(password)) };
    await prisma.user.upsert({ where: { username }, create: { username, ...data }, update: data });
    console.log(`Admin '${username}' can now log in.`);
  } else {
    console.log('Set ADMIN_USERNAME and ADMIN_PASSWORD and run the seed again to create an admin.');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
