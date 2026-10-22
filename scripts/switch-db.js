const fs = require('fs');
const path = require('path');

const targetProvider = process.argv[2] || 'postgresql';
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.error('Error: prisma/schema.prisma not found!');
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (targetProvider === 'postgresql') {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('✅ Set Prisma provider to: postgresql (for Vercel & Production)');
} else if (targetProvider === 'sqlite') {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('✅ Set Prisma provider to: sqlite (for Local Development)');
} else {
  console.error(`Unknown provider: ${targetProvider}. Use "postgresql" or "sqlite"`);
  process.exit(1);
}

fs.writeFileSync(schemaPath, content, 'utf8');
