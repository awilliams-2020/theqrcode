#!/bin/bash

echo "🐳 Setting up QR Analytics SaaS with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if environment variables are set
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "⚠️  Warning: NEXTAUTH_SECRET environment variable is not set"
    echo "   Please set it in your .env file or environment"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /home/awilliams/postgres-data
mkdir -p /home/awilliams/logs

# Set proper permissions
chmod 755 /home/awilliams/postgres-data
chmod 755 /home/awilliams/logs

echo "🔧 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your environment variables (see .env.qr-analytics)"
echo "2. Update your DNS to point qr.redbudway.com to your server"
echo "3. Run: docker-compose up -d qr-analytics postgres"
echo "4. Check logs: docker-compose logs -f qr-analytics"
echo ""
echo "The app will be available at: https://qr.redbudway.com"
echo ""
echo "📚 Check README.md for detailed setup instructions"
