const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

console.log('🔍 Environment Check');
console.log('==================');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('📋 Environment variables:');
  envVars.forEach(line => {
    const [key] = line.split('=');
    if (key) {
      console.log(`   ${key}`);
    }
  });
} else {
  console.log('❌ .env file not found');
  console.log('💡 Copy .env.example to .env and configure your settings');
}

console.log('\n🚀 Ready to run: npm run dev');
