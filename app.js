// Example chat data
const chatData = {
  "@anshul": ["Hi", "What's up?", "I'm Anshul"],
  "@tanush": ["Hello!", "How are you?"],
  "@avni": ["Good morning!", "Let's catch up later."],
};

// Get DOM elements
const requests = document.querySelectorAll(".request-item");
const chats = document.querySelectorAll(".chat-item");
const messagesContainer = document.querySelector(".messages");
const chatHeader = document.querySelector(".chat-header");

// Function to load chat messages
function loadChat(user) {
  // Update chat header
  chatHeader.textContent = user;

  // Clear existing messages
  messagesContainer.innerHTML = "";

  // Load messages for the selected user
  const messages = chatData[user] || [];
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    div.classList.add("message", "received"); // Default received style
    messagesContainer.appendChild(div);
  });
}

// Add event listeners to load different chats
[...requests, ...chats].forEach((item) => {
  item.addEventListener("click", () => {
    const user = item.textContent;
    loadChat(user);
  });
});

// Sending messages
const inputField = document.querySelector(".message-input input");
const sendButton = document.querySelector(".send-btn");

sendButton.addEventListener("click", () => {
  const text = inputField.value.trim();
  if (text) {
    // Create a new sent message
    const div = document.createElement("div");
    div.textContent = text;
    div.classList.add("message", "sent");
    messagesContainer.appendChild(div);

    // Clear the input field
    inputField.value = "";

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
