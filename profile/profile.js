// Initialize IndexedDB
let db;
const request = indexedDB.open("SpotifynderDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore("profiles", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("username", "username", { unique: true });
    objectStore.createIndex("email", "email", { unique: false });
    objectStore.createIndex("artists", "artists", { unique: false });
    objectStore.createIndex("tracks", "tracks", { unique: false });
    objectStore.createIndex("playlists", "playlists", { unique: false });
    objectStore.createIndex("prompts", "prompts", { unique: false });
    console.log("Database setup complete.");
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Database opened successfully");
    loadProfileData(1); // Load profile data on page load
};

request.onerror = (event) => {
    console.error("Database error:", event.target.errorCode);
};

// Function to add custom prompts
function addCustomPrompt() {
    const maxPrompts = 3; // Set the maximum number of prompts
    const addPromptButton = document.querySelector(".add-prompt");
    const personalityPrompts = document.querySelector(".personality-prompts");

    addPromptButton.addEventListener("click", () => {
        const currentPrompts = document.querySelectorAll(".personality-prompts .prompt").length;

        if (currentPrompts < maxPrompts) {
            const newPrompt = document.createElement("div");
            newPrompt.classList.add("prompt");
            newPrompt.innerHTML = `
                <input type="text" placeholder="Question">
                <textarea placeholder="Answer..."></textarea>
            `;
            personalityPrompts.insertBefore(newPrompt, addPromptButton);
            saveProfileData(); // Automatically save data after adding a prompt
        } else {
            alert("You've hit the high note on prompts! Try editing your top picks!");
        }
    });
}

// Function to collect prompt data
function collectPrompts() {
    const prompts = [];
    document.querySelectorAll(".personality-prompts .prompt").forEach(prompt => {
        const question = prompt.querySelector("input").value;
        const answer = prompt.querySelector("textarea").value;
        prompts.push({ question, answer });
    });
    return prompts;
}

// Function to save profile data automatically
function saveProfileData() {
    if (!db) {
        console.error("IndexedDB is not available.");
        return;
    }

    const username = document.querySelector(".user-info p").textContent;
    const email = "aanyamehta@umass.edu"; // Static email, adjust as needed
    const artists = Array.from(document.querySelectorAll("#artists .item-placeholder img")).map(img => img.src);
    const tracks = Array.from(document.querySelectorAll("#tracks .item-placeholder img")).map(img => img.src);
    const playlists = Array.from(document.querySelectorAll("#playlists .item-placeholder img")).map(img => img.src);
    const prompts = collectPrompts();

    const profile = {
        id: 1, // Assumes a single user
        username,
        email,
        artists,
        tracks,
        playlists,
        prompts
    };

    const transaction = db.transaction(["profiles"], "readwrite");
    const objectStore = transaction.objectStore("profiles");
    const request = objectStore.put(profile);

    request.onsuccess = () => {
        console.log("Profile data saved successfully.");
    };

    request.onerror = (event) => {
        console.error("Error saving profile data to IndexedDB:", event.target.error);
    };
}

// Function to load profile data
function loadProfileData(key) {
    const transaction = db.transaction(["profiles"], "readonly");
    const objectStore = transaction.objectStore("profiles");
    const request = objectStore.get(key);

    request.onsuccess = (event) => {
        const profile = event.target.result;
        if (profile) {
            document.querySelector(".user-info p").textContent = profile.username;
            document.querySelector("#artists").innerHTML = profile.artists.map(artist => `
                <div class="item-placeholder"><img src="${artist}.jpg" alt="${artist}"></div>
            `).join("");
            document.querySelector("#tracks").innerHTML = profile.tracks.map(track => `
                <div class="item-placeholder"><img src="${track}.jpg" alt="${track}"></div>
            `).join("");
            document.querySelector("#playlists").innerHTML = profile.playlists.map(playlist => `
                <div class="item-placeholder"><img src="${playlist}.jpg" alt="${playlist}"></div>
            `).join("");
            populatePrompts(profile.prompts);
        }
    };

    request.onerror = (event) => {
        console.error("Error loading profile data:", event.target.error);
    };
}

// Function to populate prompts from saved data
function populatePrompts(prompts) {
    const personalityPrompts = document.querySelector(".personality-prompts");
    personalityPrompts.innerHTML = ''; // Clear existing prompts

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

document.addEventListener("DOMContentLoaded", () => {
    const maxPrompts = 3; // Set max number of prompts to 3 based on Ui diagram
    const addPromptButton = document.querySelector(".add-prompt");
    const personalityPrompts = document.querySelector(".personality-prompts");

    // Event listener for adding new prompt
    addPromptButton.addEventListener("click", () => {
        // Check the curr no of prompts
        const currentPrompts = document.querySelectorAll(".personality-prompts .prompt").length;

        if (currentPrompts < maxPrompts) {
            // Add new prompt if curr prompts < max
            const newPrompt = document.createElement("div");
            newPrompt.classList.add("prompt");
            newPrompt.innerHTML = `
                <input type="text" placeholder="Question">
                <textarea placeholder="Answer..."></textarea>
            `;
            personalityPrompts.insertBefore(newPrompt, addPromptButton); // Insert the new prompt before add button
        } else {
            // Notify user max no of prompts reached
            alert("You've hit the high note on prompts! Try editing your top picks!");
        }
    });
});
