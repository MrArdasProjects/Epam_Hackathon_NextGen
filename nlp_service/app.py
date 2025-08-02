from flask import Flask, request, jsonify
from rag import find_best_tool

app = Flask(__name__)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    result = find_best_tool(message)
    return jsonify({"response": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
