#!/bin/bash

set -e

echo "🚀 E-Commerce Application Setup Script"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Detect Docker Compose command (v1 or v2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Start database
echo "📦 Starting PostgreSQL database with Docker..."
$DOCKER_COMPOSE up -d
echo "⏳ Waiting for database to be ready..."
echo "   This may take 30-60 seconds on first startup..."

# Wait for PostgreSQL to be healthy using docker-compose healthcheck
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if $DOCKER_COMPOSE exec -T postgres pg_isready -U ecommerce > /dev/null 2>&1; then
        echo "✅ Database is ready and accepting connections"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Database failed to become ready after $max_attempts attempts"
        echo "   Please check Docker logs: $DOCKER_COMPOSE logs postgres"
        exit 1
    fi
    echo "   Attempt $attempt/$max_attempts - waiting..."
    sleep 2
done
echo ""

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Create .env file from .env.example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
cd ..
echo "✅ Backend setup complete"
echo ""

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install
cd ..
echo "✅ Frontend setup complete"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1 - Backend:  cd backend && npm run dev"
echo "2. Terminal 2 - Frontend: cd frontend && ng serve"
echo ""
echo "Then open http://localhost:4200 in your browser"
echo ""
echo "Default admin account:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "Default user account:"
echo "  Email: user@example.com"
echo "  Password: user123"
