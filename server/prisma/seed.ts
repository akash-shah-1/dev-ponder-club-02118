import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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