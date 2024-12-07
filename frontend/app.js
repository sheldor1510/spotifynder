// Example chat data for initial display

const initialChatData = {
  "@anshul": [
    {
      messageType: "received",
      message: "Hi"
    }, 
    {
      messageType: "received",
      message: "What's up?"
    }, 
    {
      messageType: "received",
      message: "I'm Anshul"
    }],

    "@tanush": [
    {
      messageType: "received",
      message: "Hello!"
    }, 
    {
      messageType: "received",
      message: "How are you?"
    }],
    "@avni": [
    {
      messageType: "received",
      message: "Good Morning!"
    }, 
    {
      messageType: "received",
      message: "Let's catch up soon :)"
    }],
 
};

// IndexedDB setup
let chatDB;
const chatDBrequest = indexedDB.open("ChatAppDB", 1);

chatDBrequest.onupgradeneeded = (event) => {
  chatDB = event.target.result;
  const objectStore = chatDB.createObjectStore("chats", { keyPath: "user" });
  console.log("IndexedDB: Object store created.");

  // Preload initial chat data into IndexedDB
  const transaction = objectStore.transaction;
  Object.keys(initialChatData).forEach((user) => {
    objectStore.add({ user, messages: initialChatData[user] });
  });
};

chatDBrequest.onsuccess = (event) => {
  chatDB = event.target.result;
  console.log("IndexedDB: Database initialized.");
};

chatDBrequest.onerror = (event) => {
  console.error("IndexedDB: Error opening database", event.target.error);
};

// Get DOM elements
const requests = document.querySelectorAll(".request-item");
const chats = document.querySelectorAll(".chat-item");
const messagesContainer = document.querySelector(".messages");
const chatHeader = document.querySelector(".chat-header");
const inputField = document.querySelector(".message-input input");
const sendButton = document.querySelector(".send-btn");

// Function to load chat messages from IndexedDB
function loadChat(user) {
  const transaction = chatDB.transaction(["chats"], "readonly");
  const objectStore = transaction.objectStore("chats");
  const request = objectStore.get(user);

  request.onsuccess = (event) => {
    const data = event.target.result;

    // Update chat header
    chatHeader.textContent = user;

    // Clear existing messages
    messagesContainer.innerHTML = "";

    // Load messages
    const messages = data ? data.messages : [];
    messages.forEach((msg) => {
      const div = document.createElement("div");
      div.textContent = msg.message;
      div.classList.add("message", msg.messageType);
      messagesContainer.appendChild(div);
    });
  };

  request.onerror = () => {
    console.error("Failed to retrieve chat data for", user);
  };
}

// Function to save a new message in IndexedDB
function saveMessage(user, message, isSent) {
  const transaction = chatDB.transaction(["chats"], "readwrite");
  const objectStore = transaction.objectStore("chats");
  const request = objectStore.get(user);

  request.onsuccess = (event) => {
    let data = event.target.result;

    if (!data) {
      // If no chat history exists for the user, create it
      data = { user, messages: [] };
    }

    // Add the message to the array
    data.messages.push({
      messageType: "sent",
      message: message
    });

    // Save updated data
    objectStore.put(data);
  };

  request.onerror = () => {
    console.error("Failed to save message for", user);
  };
}

// Add event listeners to load different chats
[...requests, ...chats].forEach((item) => {
  item.addEventListener("click", () => {
    const user = item.textContent;
    loadChat(user);
  });
});

sendButton.addEventListener("click", () => {
  const text = inputField.value.trim();
  if (text) {
    // Create a new sent message
    const div = document.createElement("div");
    div.textContent = text;
    div.classList.add("message", "sent"); // Add the "sent" class for styling
    messagesContainer.appendChild(div);

    // Clear the input field
    inputField.value = "";

    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Save the message to IndexedDB
    saveMessage(chatHeader.textContent, text);
  }
});

