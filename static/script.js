const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

// Change this if your Flask server runs on a different host/port
const CHATBOT_ENDPOINT = "/chatbot";
const RESET_ENDPOINT = "/reset";

function addMessage(text, sender) {
  const bubble = document.createElement("div");
  bubble.className = `message ${sender}`;
  bubble.textContent = text;
  messagesContainer.appendChild(bubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return bubble;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.id = "typing-indicator";
  typing.textContent = "Lumo is typing...";
  messagesContainer.appendChild(typing);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";
  showTyping();

  try {
    const res = await fetch(CHATBOT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const data = await res.json();
    hideTyping();

    if (data.error) {
      addMessage(`Error: ${data.error}`, "bot");
    } else {
      addMessage(data.response, "bot");
    }
  } catch (err) {
    hideTyping();
    addMessage("Sorry, I couldn't reach the server. Is it running?", "bot");
    console.error(err);
  }
}

async function resetChat() {
  messagesContainer.innerHTML = "";
  addMessage("Hi, I'm Lumo! How can I help you today?", "bot");
  try {
    await fetch(RESET_ENDPOINT, { method: "POST" });
  } catch (err) {
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
resetBtn.addEventListener("click", resetChat);

// Greet the user on load
window.addEventListener("DOMContentLoaded", () => {
  addMessage("Hi, I'm Lumo! How can I help you today?", "bot");
});
