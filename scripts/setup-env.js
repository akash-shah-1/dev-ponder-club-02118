const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
  console.log('\n🚀 DevOverflow Environment Setup\n');
  console.log('This script will help you set up your environment variables.\n');

  // Server .env
  const serverEnvPath = path.join(__dirname, '../server/.env');
  const serverEnvExample = path.join(__dirname, '../server/.env.example');

  if (!fs.existsSync(serverEnvPath)) {
    console.log('📝 Setting up server environment variables...\n');

    const databaseUrl = await question('Enter your DATABASE_URL (PostgreSQL): ');
    const clerkSecretKey = await question('Enter your CLERK_SECRET_KEY: ');
    const clerkPublishableKey = await question('Enter your CLERK_PUBLISHABLE_KEY: ');
    const geminiApiKey = await question('Enter your GEMINI_API_KEY: ');
    const jwtSecret = await question('Enter your JWT_SECRET (or press Enter for default): ') || 'your-super-secret-jwt-key';
    const adminEmail = await question('Enter admin email (default: admin@example.com): ') || 'admin@example.com';
    const adminPassword = await question('Enter admin password (default: admin123): ') || 'admin123';

    const serverEnv = `DATABASE_URL="${databaseUrl}"
CLERK_SECRET_KEY="${clerkSecretKey}"
CLERK_PUBLISHABLE_KEY="${clerkPublishableKey}"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="${jwtSecret}"
PORT=3001

# AI Service Configuration
GEMINI_API_KEY=${geminiApiKey}
GEMINI_MODEL=gemini-2.0-flash-exp

# RAG System Configuration
SIMILARITY_THRESHOLD=0.65
BATCH_SIZE=10

# Admin Configuration
ADMIN_USER_EMAIL=${adminEmail}
ADMIN_USER_PASSWORD=${adminPassword}
`;

    fs.writeFileSync(serverEnvPath, serverEnv);
    console.log('✅ Server .env file created!\n');
  } else {
    console.log('✅ Server .env file already exists.\n');
  }

  // Client .env.local
  const clientEnvPath = path.join(__dirname, '../client/.env.local');

  if (!fs.existsSync(clientEnvPath)) {
    console.log('📝 Setting up client environment variables...\n');

    const clerkPublishableKey = await question('Enter your VITE_CLERK_PUBLISHABLE_KEY: ');
    const apiUrl = await question('Enter API URL (default: http://localhost:3001): ') || 'http://localhost:3001';
    const vapiPublicKey = await question('Enter your VITE_VAPI_PUBLIC_KEY (optional, press Enter to skip): ') || '';

    const clientEnv = `VITE_CLERK_PUBLISHABLE_KEY=${clerkPublishableKey}
VITE_API_URL=${apiUrl}
${vapiPublicKey ? `VITE_VAPI_PUBLIC_KEY=${vapiPublicKey}` : '# VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here'}
`;

    fs.writeFileSync(clientEnvPath, clientEnv);
    console.log('✅ Client .env.local file created!\n');
  } else {
    console.log('✅ Client .env.local file already exists.\n');
  }

  console.log('🎉 Environment setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run: npm run setup:db');
  console.log('  2. Run: npm run dev\n');

  rl.close();
}

setupEnv().catch(console.error);
