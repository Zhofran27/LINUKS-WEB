import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, pool } from './db';
import { categories, statuses, users } from './schema';

const categorySeeds = [
  { name: 'Physical Safety' },
  { name: 'Digital Security' },
  { name: 'Harassment' },
  { name: 'Others'}
];

const statusSeeds = [
  { name: 'Menunggu Verifikasi' },
  {name: 'Perlu Klarifikasi' },
  { name: 'Diproses' },
  {name: "Diteruskan ke Satgas"},
  { name: 'Selesai' },
  { name: 'Ditolak' },
];

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
}


const adminSeeds = [
  {
    name: 'admin',
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 10),
    role: 'admin',
  }
]
await db.insert(categories).values(categorySeeds).onConflictDoNothing();
await db.insert(statuses).values(statusSeeds).onConflictDoNothing();

for (const admin of adminSeeds) {
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, admin.email));

  if (existingAdmin.length > 0) {
    await db
      .update(users)
      .set(admin)
      .where(eq(users.email, admin.email));
  } else {
    await db.insert(users).values(admin);
  }
}

await pool.end();

console.log('Seed categories, statuses, and admins done');
