from flask import Flask, jsonify, request
from flask_cors import CORS
from inference import Chatbot
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

chatbot = Chatbot()

@app.route('/')
def home():
    logger.info("Root endpoint accessed")
    return jsonify({"message": "Arogya AI Chatbot API is running. Use /api/chat to interact."})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        logger.debug(f"Received request: {data}")
        query = data.get('message')
        if not query:
            logger.warning("No message provided in request")
            return jsonify({"error": "No message provided"}), 400

        result = chatbot.process_query(query)
        logger.debug(f"Response: {result}")
        return jsonify({
            "response": result["response"],
            "alert": result["alert"],
            "timestamp": request.json.get("timestamp")
        })
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)