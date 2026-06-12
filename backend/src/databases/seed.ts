import { db, pool } from './db';
import { categories, statuses } from './schema';

const categorySeeds = [
  { name: 'Verbal' },
  { name: 'Non-Verbal' },
  { name: 'Lainnya' },
];

const statusSeeds = [
  { name: 'Menunggu Verifikasi' },
  {name: 'Perlu Klarifikasi' },
  { name: 'Diproses' },
  {name: "Diteruskan ke Satgas"},
  { name: 'Selesai' },
  { name: 'Ditolak' },
];



await db.insert(categories).values(categorySeeds).onConflictDoNothing();
await db.insert(statuses).values(statusSeeds).onConflictDoNothing();

await pool.end();

console.log('Seed categories and statuses done');
