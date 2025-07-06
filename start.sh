#!/bin/bash

# Nenad Portfolio v5 - Startup Script

echo "🚀 Starting Nenad Portfolio v5..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys before running again."
    exit 1
fi

# Check Python version
python_version=$(python3 --version 2>&1 | grep -o '3\.[0-9]\+')
required_version="3.10"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python 3.10 or higher is required. Current version: $python_version"
    exit 1
fi

echo "✅ Python version check passed: $python_version"

# Check if poetry is available
if command -v poetry &> /dev/null; then
    echo "📦 Using Poetry for dependency management..."
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    poetry install
    
    # Run the application
    echo "🌐 Starting Flask development server..."
    poetry run python app.py
else
    echo "📦 Poetry not found, using pip..."
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    
    # Run the application
    echo "🌐 Starting Flask development server..."
    python app.py
fi 