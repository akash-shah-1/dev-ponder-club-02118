import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // Correct import for bcryptjs

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Tags
  const tags = [
    { name: 'javascript', description: 'JavaScript programming language', color: '#f7df1e' },
    { name: 'typescript', description: 'TypeScript programming language', color: '#3178c6' },
    { name: 'react', description: 'React JavaScript library', color: '#61dafb' },
    { name: 'nodejs', description: 'Node.js runtime environment', color: '#339933' },
    { name: 'python', description: 'Python programming language', color: '#3776ab' },
    { name: 'nextjs', description: 'Next.js React framework', color: '#000000' },
    { name: 'nestjs', description: 'NestJS Node.js framework', color: '#e0234e' },
    { name: 'prisma', description: 'Prisma database toolkit', color: '#2d3748' },
    { name: 'postgresql', description: 'PostgreSQL database', color: '#336791' },
    { name: 'authentication', description: 'User authentication and security', color: '#ff6b6b' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  // Seed Admin User
  const adminEmail = process.env.ADMIN_USER_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_USER_PASSWORD || 'password123'; // CHANGE THIS IN PRODUCTION!
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        clerkId: 'clerk_admin_id_placeholder', // Placeholder, as we're not using Clerk for this admin
        email: adminEmail,
        name: 'Admin User',
        isAdmin: true, // Mark as admin
        password: hashedPassword, // Store the hashed password
      },
    });
    console.log(`✅ Admin user "${adminEmail}" created.`);
  } else {
    // If admin exists, ensure isAdmin is true and update password if it changed (optional, could be manual)
    if (!existingAdmin.isAdmin) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { isAdmin: true, password: hashedPassword },
      });
      console.log(`✅ Existing user "${adminEmail}" updated to be an admin.`);
    } else {
      // Optionally update password if admin user already exists but password needs to be re-seeded
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword },
      });
      console.log(`✅ Admin user "${adminEmail}" already exists and password updated.`);
    }
  }


  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });