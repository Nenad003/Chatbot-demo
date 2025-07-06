#!/bin/bash

# Setup Environment Variables Script
echo "🔧 Setting up environment variables..."

# Create .env file with the provided API key
cat > .env << EOF
# Flask Configuration
SESSION_SECRET=nenad-portfolio-v5-super-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True

# Anthropic API Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration
PORT=5000
HOST=0.0.0.0

# Database Configuration (if needed later)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
EOF

echo "✅ Environment variables file (.env) created successfully!"
echo "🔑 Anthropic API key has been configured"
echo ""
echo "You can now run the application with:"
echo "  ./start.sh"
echo "  or"
echo "  python app.py"

ls ~/.ssh/id_*.pub

ssh-keygen -t ed25519 -C "your_email@example.com"

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519 

cat ~/.ssh/id_ed25519.pub 