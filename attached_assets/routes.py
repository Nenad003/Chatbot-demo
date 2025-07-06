from flask import render_template, request, jsonify
from app import app
from chatbot import get_chatbot_response

@app.route('/')
def index():
    """Render the main portfolio page"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chatbot messages"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        response = get_chatbot_response(message)
        return jsonify({'response': response})
    
    except Exception as e:
        app.logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Sorry, I encountered an error. Please try again.'}), 500
