// Get DOM elements
const requests = document.querySelectorAll(".request-item");
const messagesContainer = document.querySelector(".messages");
const chatHeader = document.querySelector(".chat-header");
const inputField = document.querySelector(".message-input input");
const sendButton = document.querySelector(".send-btn");
const chatList = document.querySelector(".chat-list"); // Sidebar for displaying chats

// Function to fetch all chats for the logged-in user
async function fetchUserChats() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:5001/api/chats?accessToken=${accessToken}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user chats: ${response.statusText}`);
    }

    const chats = await response.json();

    // Populate the chat list in the UI
    chatList.innerHTML = ""; // Clear any existing chat items

    chats.forEach((chat) => {
      const chatItem = document.createElement("li");
      chatItem.textContent = chat.match_id; // Replace with user-friendly display if available
      chatItem.classList.add("chat-item");
      chatItem.setAttribute("data-match-id", chat.match_id);

      chatItem.addEventListener("click", () => loadChat(chat.match_id));
      chatList.appendChild(chatItem);
    });

    console.log("User chats loaded successfully");
  } catch (error) {
    console.error(error.message);
  }
}

// Function to load chat messages from the backend
async function loadChat(match_id) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:5001/api/chats/${match_id}?accessToken=${accessToken}`);

    if (!response.ok) {
      throw new Error(`Failed to load chat history: ${response.statusText}`);
    }

    const chatHistory = await response.json();

    // Update chat header
    chatHeader.textContent = `Chat with Match ID: ${match_id}`;

    // Clear existing messages
    messagesContainer.innerHTML = "";

    // Load messages
    chatHistory.forEach((msg) => {
      const div = document.createElement("div");
      div.textContent = msg.message;
      div.classList.add("message", msg.sender === "currentUserId" ? "sent" : "received");
      messagesContainer.appendChild(div);
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Function to send and save a new message
async function saveMessage(matchId, message) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:5001/api/chats/message?accessToken=${accessToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchId, message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Message sent successfully:", data);
  } catch (error) {
    console.error(error.message);
  }
}

// Event listener to load different chats
document.addEventListener("DOMContentLoaded", () => {
  // Fetch user chats on page load
  fetchUserChats();

  [...requests].forEach((item) => {
    item.addEventListener("click", () => {
      const user = item.textContent;
      loadChat(user);
    });
  });
});

// Event listener for sending messages
sendButton.addEventListener("click", () => {
  const text = inputField.value.trim();
  if (text) {
    const matchId = chatHeader.textContent.split(": ")[1]; // Extract match_id from header

    // Create a new sent message
    const div = document.createElement("div");
    div.textContent = text;
    div.classList.add("message", "sent"); // Add the "sent" class for styling
    messagesContainer.appendChild(div);

    // Clear the input field
    inputField.value = "";

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save the message to the backend
    saveMessage(matchId, text);
  }
});
