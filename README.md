# Lumo — Simple Chatbot

A minimal chatbot with a Flask backend (Hugging Face `blenderbot-400M-distill`) and a plain HTML/CSS/JS frontend.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

## Project structure

```
lumo-chatbot/
├── app.py                 # Flask backend + model loading
├── requirements.txt
├── templates/
│   └── index.html         # Chat UI markup
└── static/
    ├── style.css           # Chat UI styling
    └── script.js           # Sends messages to /chatbot, renders replies
```

## Notes

- The model downloads (~1.6GB) on first run — this can take a few minutes.
- Conversation history is kept server-side in memory and resets on restart, or via the "New chat" button (calls `/reset`).
- To swap in a different model, change `MODEL_NAME` in `app.py` — any Hugging Face seq2seq conversational model will work with minor tweaks.
- This uses Flask's built-in dev server. For anything beyond local testing, put it behind a production WSGI server (e.g. gunicorn).
