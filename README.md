# Nenad Mahesh Gowda - Portfolio Website v5

A modern portfolio website with an AI-powered chatbot built using Flask and Anthropic Claude.

## Features

- **Professional Portfolio**: Showcase Nenad's experience, education, and achievements
- **AI Chatbot**: Interactive chatbot powered by Anthropic Claude 3.5 Sonnet
- **Responsive Design**: Modern, mobile-friendly interface
- **Production Ready**: Configured for deployment on various platforms

## Tech Stack

- **Backend**: Flask (Python)
- **AI Chatbot**: Anthropic Claude 3.5 Sonnet
- **Production Server**: Gunicorn
- **Package Management**: Poetry (with pip fallback)
- **Environment Management**: python-dotenv

## Quick Start

### Prerequisites

- Python 3.10 or higher
- Poetry (recommended) or pip
- Anthropic API key

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd v5
   ```

2. **Install dependencies**
   
   **Using Poetry (recommended):**
   ```bash
   pip install poetry
   poetry install
   ```
   
   **Using pip:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env and add your Anthropic API key
   ```

4. **Run the development server**
   
   **Using Poetry:**
   ```bash
   poetry run python app.py
   # or with auto-reload:
   poetry run flask run --reload
   ```
   
   **Using pip:**
   ```bash
   python app.py
   # or with auto-reload:
   flask run --reload
   ```

5. **Access the application**
   - Open http://localhost:5000 in your browser

## API Endpoints

### GET `/`
- **Description**: Main portfolio page
- **Response**: HTML template

### POST `/chat`
- **Description**: AI chatbot endpoint
- **Request Body**: `{"message": "user message"}`
- **Response**: `{"response": "ai response"}`

#### Testing the Chat Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Nenad\'s experience"}'
```

**Using Postman:**
- Method: POST
- URL: `http://localhost:5000/chat`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "message": "Tell me about Nenad's experience"
  }
  ```

## Production Deployment

### Environment Variables

Set these environment variables in production:

```bash
SESSION_SECRET=your-super-secret-session-key
ANTHROPIC_API_KEY=your-anthropic-api-key
PORT=5000  # or let the platform set this
```

### Deployment Options

#### 1. Render.com

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

#### 2. Replit

The `.replit` file is already configured for Replit deployment.

#### 3. Heroku

The `Procfile` is already configured for Heroku deployment.

#### 4. Railway

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

#### 5. DigitalOcean App Platform

**Build Command:**
```bash
pip install -r requirements.txt
```

**Run Command:**
```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

### Production Server Commands

**Basic Gunicorn:**
```bash
gunicorn app:app --bind 0.0.0.0:5000
```

**With multiple workers:**
```bash
gunicorn app:app --bind 0.0.0.0:5000 --workers 4
```

**With timeout and reload:**
```bash
gunicorn app:app --bind 0.0.0.0:5000 --workers 2 --timeout 120 --reload
```

## Project Structure

```
v5/
├── app.py              # Main Flask application
├── routes.py           # API routes and endpoints
├── chatbot.py          # AI chatbot implementation
├── templates/          # HTML templates
│   └── index.html      # Main portfolio page
├── static/             # Static assets (CSS, JS, images)
├── attached_assets/    # Additional assets
├── pyproject.toml      # Poetry dependencies
├── requirements.txt    # Pip dependencies
├── Procfile           # Heroku deployment
├── runtime.txt        # Python version specification
├── .replit           # Replit configuration
└── env.example       # Environment variables template
```

## Security Notes

- **API Keys**: Never commit API keys to version control
- **Session Secret**: Use a strong, random session secret in production
- **Environment Variables**: Use `.env` file for local development
- **HTTPS**: Enable HTTPS in production environments

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Missing dependencies**
   ```bash
   poetry install
   # or
   pip install -r requirements.txt
   ```

3. **API key not working**
   - Check that `ANTHROPIC_API_KEY` is set in your environment
   - Verify the API key is valid and has sufficient credits

4. **Import errors**
   - Ensure you're using Python 3.10+
   - Check that all dependencies are installed

## Contact

For questions or issues, contact Nenad Mahesh Gowda:
- Email: nenadgowda@gmail.com
- Phone: +91 9960865675
- LinkedIn: linkedin.com/in/nenad-gowda/ # Chatbot-Demo-Website
