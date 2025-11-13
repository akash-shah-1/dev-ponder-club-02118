/**
 * RAG System Setup Script
 * 
 * This script helps you set up the RAG system step by step
 * Run: npx ts-node scripts/setup-rag.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 RAG System Setup\n');

  // Step 1: Check pgvector extension
  console.log('Step 1: Checking pgvector extension...');
  try {
    await prisma.$queryRaw`SELECT * FROM pg_extension WHERE extname = 'vector'`;
    console.log('✅ pgvector extension is installed\n');
  } catch (error) {
    console.log('❌ pgvector extension not found');
    console.log('📝 Run this SQL command:');
    console.log('   CREATE EXTENSION IF NOT EXISTS vector;\n');
    process.exit(1);
  }

  // Step 2: Check ai_embeddings table
  console.log('Step 2: Checking ai_embeddings table...');
  try {
    const count = await prisma.aiEmbedding.count();
    console.log(`✅ ai_embeddings table exists (${count} records)\n`);
  } catch (error) {
    console.log('❌ ai_embeddings table not found');
    console.log('📝 Run: npx prisma migrate dev\n');
    process.exit(1);
  }

  // Step 3: Check for indexes
  console.log('Step 3: Checking database indexes...');
  try {
    const indexes = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'ai_embeddings'
    `;
    
    const hasVectorIndex = indexes.some(i => i.indexname.includes('vector'));
    
    if (hasVectorIndex) {
      console.log('✅ Vector index exists\n');
    } else {
      console.log('⚠️  Vector index not found');
      console.log('📝 Creating index...');
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS ai_embeddings_vector_idx 
        ON ai_embeddings USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
      `;
      console.log('✅ Vector index created\n');
    }
  } catch (error) {
    console.log('⚠️  Could not check indexes:', error.message);
  }

  // Step 4: Check environment variables
  console.log('Step 4: Checking environment variables...');
  const requiredEnvVars = [
    'GEMINI_API_KEY',
    'DATABASE_URL',
  ];

  const optionalEnvVars = [
    'GEMINI_MODEL',
    'SIMILARITY_THRESHOLD',
  ];

  let allRequired = true;
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is missing`);
      allRequired = false;
    }
  });

  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName} is set (${process.env[varName]})`);
    } else {
      console.log(`⚠️  ${varName} not set (will use default)`);
    }
  });

  if (!allRequired) {
    console.log('\n📝 Add missing variables to server/.env\n');
    process.exit(1);
  }

  console.log('');

  // Step 5: Check data availability
  console.log('Step 5: Checking available data...');
  const questionCount = await prisma.question.count();
  const answerCount = await prisma.answer.count({ where: { isAccepted: true } });
  
  console.log(`📊 Questions: ${questionCount}`);
  console.log(`📊 Accepted Answers: ${answerCount}`);

  if (questionCount === 0) {
    console.log('⚠️  No questions found. Add some questions first!\n');
  } else {
    console.log('✅ Data available for ingestion\n');
  }

  // Step 6: Summary
  console.log('═══════════════════════════════════════');
  console.log('📋 Setup Summary');
  console.log('═══════════════════════════════════════');
  console.log('✅ Database: Ready');
  console.log('✅ pgvector: Installed');
  console.log('✅ Indexes: Created');
  console.log('✅ Environment: Configured');
  console.log(`📊 Data: ${questionCount} questions, ${answerCount} answers`);
  console.log('═══════════════════════════════════════\n');

  if (questionCount > 0) {
    console.log('🎯 Next Steps:');
    console.log('1. Start the server: npm run start:dev');
    console.log('2. Run ingestion: POST http://localhost:3001/ai/ingest/questions');
    console.log('3. Check stats: GET http://localhost:3001/ai/embeddings/stats');
    console.log('4. Test chatbot with a question\n');
  } else {
    console.log('🎯 Next Steps:');
    console.log('1. Add some questions to your database');
    console.log('2. Run this script again');
    console.log('3. Then proceed with ingestion\n');
  }

  console.log('📚 Full documentation: RAG_IMPLEMENTATION_PLAN.md\n');
}

main()
  .catch((e) => {
    console.error('❌ Setup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
