#!/bin/bash

echo "🚀 Setting up QR Analytics SaaS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

echo "🔧 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Update .env.local with your database URL and other secrets"
echo "3. Run: npx prisma migrate dev"
echo "4. Run: npm run dev"
echo ""
echo "📚 Check README.md for detailed setup instructions"
