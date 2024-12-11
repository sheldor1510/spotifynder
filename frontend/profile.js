window.onload = async function() {
    await loadProfileData();
};

// Function to load profile data from the backend
async function loadProfileData() {
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
    const url = `http://localhost:5001/api/profile?accessToken=${accessToken}`; // API endpoint for fetching profile

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching profile: ${response.status}`);
        }
        const profile = await response.json(); // Parse JSON response
        console.log("profile", profile);
        populateProfileData(profile); // Populate profile data into UI
    } catch (error) {
        console.error("Error loading profile data:", error.message);
        // alert("An error occurred while loading profile data.");
    }
}

// Function to save updated profile data to the backend
async function saveProfileData() {
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
    const url = `http://localhost:5001/api/profile?accessToken=${accessToken}`; // API endpoint for saving profile

    const prompts = collectPrompts(); // Collect updated prompts from the UI

    const profile = {
        prompts // Sending prompts only
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile) // Send profile data as JSON
        });

        const result = await response.json(); // Parse JSON response
        if (result.success) {
            alert("Profile updated successfully!");
        } else {
            throw new Error(result.message || "An unknown error occurred");
        }
    } catch (error) {
        console.error("Error saving profile data:", error.message);
        alert("An error occurred while saving profile data.");
    }
}

// Function to populate profile data into the UI
function populateProfileData(profile) {
    // Populate username and email
    document.querySelector(".user-info p").textContent = profile.displayName;
    document.querySelector(".user-info p + p").textContent = profile.email;

    // Populate personality prompts
    // add questions to the personality prompts
    const promptsWithQuestions = [
        {
            question: "If you could meet one artist who would it be?",
            answer: ""
        },
        {
            question: "What's your favorite shower jam?",
            answer: ""
        },
        {
            question: "What's your dream concert?",
            answer: ""
        }
    ]

    // go through personality prompts and add them each object in order of promptsWithQuestions
    profile.personalityPrompts.forEach((prompt, index) => {
        promptsWithQuestions[index].answer = prompt;
    });
    
    populatePrompts(promptsWithQuestions);

    // Populate images for artists, tracks, and playlists
    populateNames("artists", JSON.parse(profile.topArtists));
    populateNames("tracks", JSON.parse(profile.topTracks));
    populateNames("playlists", profile.topPlaylists);
}

// Function to populate images for a section (artists, tracks, playlists)
function populateNames(containerId, items) {
    const container = document.getElementById(containerId);

    console.log("items", items);

    if (containerId === "artists") {
        container.innerHTML = items.map(item => `
            <div class="item-placeholder">
                <img src=${item.imageUrl || "Unnamed"}></img>
            </div>
        `).join("");
    }

    if (containerId === "tracks") {
        container.innerHTML = items.map(item => `
            <div class="item-placeholder">
                <img src=${item.albumImageUrl || "Unnamed"}></img>
            </div>
        `).join("");
    }

    if (containerId === "playlists") {
        container.innerHTML = items.map(item => `
            <div class="item-placeholder">
                <img src=${item.images[0].url || "Unnamed"}></img>
            </div>
        `).join("");
    }
}

// Function to populate prompts into input fields
function populatePrompts(prompts) {
    const personalityPrompts = document.querySelector(".personality-prompts");
    personalityPrompts.innerHTML = ""; // Clear existing prompts

    prompts.forEach((prompt, index) => {
        const promptDiv = document.createElement("div");
        promptDiv.classList.add("prompt");
        promptDiv.innerHTML = `
            <label for="prompt${index + 1}">Question ${index + 1}:</label>
            <input type="text" id="prompt${index + 1}" value="${prompt.question}" placeholder="Enter your question">
            <textarea id="answer${index + 1}" placeholder="Enter your answer">${prompt.answer}</textarea>
        `;
        personalityPrompts.appendChild(promptDiv);
    });
}

// Function to collect updated prompts from the UI
function collectPrompts() {
    const prompts = [];
    document.querySelectorAll(".personality-prompts .prompt").forEach((promptDiv, index) => {
        const question = promptDiv.querySelector(`#prompt${index + 1}`).value.trim();
        const answer = promptDiv.querySelector(`#answer${index + 1}`).value.trim();

        if (question && answer) {
            prompts.push({ question, answer });
        }
    });
    return prompts;
}

// Add event listeners for Save button and initialize profile data loading
document.addEventListener("DOMContentLoaded", () => {
    const savePromptsButton = document.querySelector("#save-prompts-btn");

    savePromptsButton.addEventListener("click", () => {
        saveProfileData(); // Save updated prompts to the backend
    });

    loadProfileData(); // Fetch and display profile data from the backend
});
