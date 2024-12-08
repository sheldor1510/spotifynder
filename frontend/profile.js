// Dummy profile data with image paths

const dummyProfile = {
    id: 1,
    username: "@aanyamehta",
    email: "aanyamehta@umass.edu",
    artists: [
        { image: "giveon.jpg" },
        { image: "gracie.jpg" },
        { image: "don.jpg" }
    ],
    tracks: [
        { image: "bf.jpg" },
        { image: "apt.jpg" },
        { image: "dws.jpg" }
    ],
    playlists: [
        { image: "playlist1.jpg" },
        { image: "playlist2.jpg" },
        { image: "playlist3.jpg" }
    ],
    prompts: [
        { question: "What is one concert you want to go to?", answer: "Coldplay" },
        { question: "What's your go-to song for a road trip?", answer: "Hotel California - Eagles" },
        { question: "If you could only listen to one artist for a month, who would it be?", answer: "Taylor Swift" }
    ]
};

// Initialize IndexedDB
let profileDB;
const profileDBRequest = indexedDB.open("SpotifynderDB", 1);

profileDBRequest.onupgradeneeded = (event) => {
    profileDB = event.target.result;

    // Create main profiles store
    const profilesStore = profileDB.createObjectStore("profiles", { keyPath: "id", autoIncrement: true });
    profilesStore.createIndex("username", "username", { unique: true });
    profilesStore.createIndex("email", "email", { unique: false });

    // Separate stores for artists, tracks, and playlists with image-only field
    const artistsStore = profileDB.createObjectStore("artists", { keyPath: "id", autoIncrement: true });
    artistsStore.createIndex("image", "image", { unique: false });

    const tracksStore = profileDB.createObjectStore("tracks", { keyPath: "id", autoIncrement: true });
    tracksStore.createIndex("image", "image", { unique: false });

    const playlistsStore = profileDB.createObjectStore("playlists", { keyPath: "id", autoIncrement: true });
    playlistsStore.createIndex("image", "image", { unique: false });

    console.log("Database setup complete.");
};

profileDBRequest.onsuccess = (event) => {
    profileDB = event.target.result;
    console.log("Database opened successfully");
    
    // Call loadProfileData only after the database is successfully opened
    loadProfileData(1); // Load profile data with default id of 1
    saveProfileData(1);
};

profileDBRequest.onerror = (event) => {
    console.error("Database error:", event.target.errorCode);
};

// Function to load profile data and related images
function loadProfileData(key = 1) {
    if (!profileDB) {
        console.error("IndexedDB is not initialized.");
        return;
    }

    // Load main profile data
    const profileTransaction = profileDB.transaction(["profiles"], "readwrite");
    const profilesStore = profileTransaction.objectStore("profiles");
    const profileRequest = profilesStore.get(key);

    profileRequest.onsuccess = (event) => {
        const profile = event.target.result || dummyProfile; // Use dummyProfile as fallback
        populateProfileData(profile);
    };

    profileRequest.onerror = (event) => {
        console.error("Error loading profile data:", event.target.error);
    };

    // Load artists images
    const artistsTransaction = profileDB.transaction(["artists"], "readwrite");
    const artistsStore = artistsTransaction.objectStore("artists");
    const artistsRequest = artistsStore.getAll();

    artistsRequest.onsuccess = (event) => {
        populateImages("artists", event.target.result);
    };

    // Load tracks images
    const tracksTransaction = profileDB.transaction(["tracks"], "readwrite");
    const tracksStore = tracksTransaction.objectStore("tracks");
    const tracksRequest = tracksStore.getAll();

    tracksRequest.onsuccess = (event) => {
        populateImages("tracks", event.target.result);
    };

    // Load playlists images
    const playlistsTransaction = profileDB.transaction(["playlists"], "readwrite");
    const playlistsStore = playlistsTransaction.objectStore("playlists");
    const playlistsRequest = playlistsStore.getAll();

    playlistsRequest.onsuccess = (event) => {
        populateImages("playlists", event.target.result);
    };
}

// Function to save profile data and images to IndexedDB
function saveProfileData() {
    if (!profileDB) {
        console.error("IndexedDB is not available.");
        return;
    }

    const username = document.querySelector(".user-info p").textContent;
    const email = "aanyamehta@umass.edu";
    const prompts = collectPrompts();

    const profile = {
        id: 1,
        username,
        email,
        prompts
    };

    const transaction = profileDB.transaction(["profiles", "artists", "tracks", "playlists"], "readwrite");

    transaction.objectStore("profiles").put(profile);

    dummyProfile.artists.forEach(artist => {
        transaction.objectStore("artists").put(artist);
    });

    dummyProfile.tracks.forEach(track => {
        transaction.objectStore("tracks").put(track);
    });

    dummyProfile.playlists.forEach(playlist => {
        transaction.objectStore("playlists").put(playlist);
    });

    transaction.oncomplete = () => {
        console.log("Profile and images saved successfully.");
    };

    transaction.onerror = (event) => {
        console.error("Error saving data to IndexedDB:", event.target.error);
    };
}

// Function to populate profile data
function populateProfileData(profile) {
    document.querySelector(".user-info p").textContent = profile.username;
    document.querySelector(".user-info p + p").textContent = profile.email;
    populatePrompts(profile.prompts);
}

// Function to populate images for artists, tracks, and playlists
function populateImages(containerId, items) {
    const container = document.getElementById(containerId);
    const placeholderImage = "https://via.placeholder.com/100"; // Fallback image URL

    container.innerHTML = items.map(item => `
        <div class="item-placeholder">
            <img src="${item.image || placeholderImage}" alt="${containerId}">
        </div>
    `).join("");
}

// Function to collect prompts
function collectPrompts() {
    const prompts = [];
    document.querySelectorAll(".personality-prompts .prompt").forEach(prompt => {
        const question = prompt.querySelector("input").value;
        const answer = prompt.querySelector("textarea").value;
        prompts.push({ question, answer });
    });
    return prompts;
}

// Function to populate prompts
function populatePrompts(prompts) {
    const personalityPrompts = document.querySelector(".personality-prompts");


    prompts.forEach(prompt => {
        const promptDiv = document.createElement("div");
        promptDiv.classList.add("prompt");
        promptDiv.innerHTML = `
            <input type="text" value="${prompt.question}" placeholder="Question">
            <textarea placeholder="Answer...">${prompt.answer}</textarea>
        `;
        personalityPrompts.insertBefore(promptDiv, document.querySelector(".add-prompt"));
    });
}

// Add event listener to Save button
document.addEventListener("DOMContentLoaded", () => {
    const savePromptsButton = document.querySelector("#save-prompts-btn");

    savePromptsButton.addEventListener("click", () => {
        saveProfileData();
        alert("Prompts saved successfully!");
    });

    // Initial profile data load
    loadProfileData(1);
});
