// Open or create IndexedDB
let db;
const request = indexedDB.open("SpotifynderDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    // Create object store for user data
    const userStore = db.createObjectStore("user", { keyPath: "id" });
    userStore.createIndex("username", "username", { unique: false });
    userStore.createIndex("profilePic", "profilePic", { unique: false });
    userStore.createIndex("unreadChats", "unreadChats", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
    loadUserProfile();
    loadUnreadChats();
};

// Function to load user profile (1a)
function loadUserProfile() {
    const transaction = db.transaction(["user"], "readonly");
    const store = transaction.objectStore("user");
    const getRequest = store.get(1); // Assuming user ID is 1

    getRequest.onsuccess = function () {
        const user = getRequest.result;
        if (user) {
            document.getElementById("profile-pic").src = user.profilePic;
            document.getElementById("username").textContent = "@" + user.username;
        }
    };
}

// Function to load unread chat count (1c)
function loadUnreadChats() {
    const transaction = db.transaction(["user"], "readonly");
    const store = transaction.objectStore("user");
    const getRequest = store.get(1);

    getRequest.onsuccess = function () {
        const user = getRequest.result;
        if (user) {
            document.getElementById("unread-count").textContent = user.unreadChats;
        }
    };
}

// Event listeners for navigation buttons
document.getElementById("discovery-btn").addEventListener("click", function() {
    // Change to Discovery view
    console.log("Discovery view selected");
});

document.getElementById("chats-btn").addEventListener("click", function() {
    // Change to Chats view
    console.log("Chats view selected");
});

document.getElementById("profile-btn").addEventListener("click", function() {
    // Change to Profile view
    console.log("Profile view selected");
});

document.getElementById("logout-btn").addEventListener("click", function() {
    // Perform logout
    console.log("Logout button clicked");
});

// Function to add initial user data (for testing)
function addUserData() {
    const transaction = db.transaction(["user"], "readwrite");
    const store = transaction.objectStore("user");

    const userData = {
        id: 1,
        username: "xxx9",
        profilePic: "path/to/profile-pic.jpg",
        unreadChats: 5
    };

    store.put(userData);
}