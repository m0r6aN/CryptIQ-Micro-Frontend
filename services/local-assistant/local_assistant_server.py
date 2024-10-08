# File path: local_assistant_server.py

from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

LM_STUDIO_URL = "http://localhost:5000"  # Update with your LM Studio's endpoint

@app.route('/query', methods=['POST'])
def query():
    user_input = request.json.get("input")
    response = requests.post(f"{LM_STUDIO_URL}/v1/completion", json={"prompt": user_input})
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(port=8080, debug=True)
