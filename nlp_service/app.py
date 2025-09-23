from flask import Flask, request, jsonify
from rag import find_best_tool, find_tool_specific_answer

app = Flask(__name__)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "tr")
    conversation_history = data.get("conversation_history", [])
    tool_name = data.get("tool_name", None)  # Tool-specific chat için
    
    if tool_name:
        # Tool-specific chat
        result = find_tool_specific_answer(tool_name, message, language, conversation_history)
    else:
        # Genel chat
        result = find_best_tool(message, language, conversation_history)
    
    return jsonify({"response": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
