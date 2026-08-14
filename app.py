"""
Lumo — a simple chatbot backend built with Flask + Hugging Face Transformers.
Serves the chat UI and exposes a /chatbot endpoint the frontend talks to.
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

app = Flask(__name__)
CORS(app)

# ---- Load the model once at startup ----
MODEL_NAME = "facebook/blenderbot-400M-distill"
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# In-memory conversation history (per-server, not per-user — fine for a demo)
conversation_history = []
MAX_HISTORY_TURNS = 6  # keep the prompt from growing unbounded


@app.route("/", methods=["GET"])
def home():
    """Serve the chat UI."""
    return render_template("index.html")


@app.route("/chatbot", methods=["POST"])
def handle_prompt():
    """Receive {'prompt': 'message'} and return Lumo's reply as plain text."""
    data = request.get_json(force=True)
    input_text = (data or {}).get("prompt", "").strip()

    if not input_text:
        return jsonify({"error": "No prompt provided"}), 400

    history_string = "\n".join(conversation_history[-MAX_HISTORY_TURNS:])

    inputs = tokenizer(history_string, input_text, return_tensors="pt")
    #inputs = tokenizer.encode_plus(history_string, input_text, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=60)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    conversation_history.append(input_text)
    conversation_history.append(response)

    return jsonify({"response": response})


@app.route("/reset", methods=["POST"])
def reset_conversation():
    """Clear the conversation history — used by the frontend's 'New chat' button."""
    conversation_history.clear()
    return jsonify({"status": "cleared"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
