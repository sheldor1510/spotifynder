
let discoveryDB;
const request = window.indexedDB.open('SpotifynderDB', 5);

async function fetchFilteredUsersFromBackend() {
    try {
        // Replace 'http://localhost:5001/api/discovery' with your actual API endpoint
        const response = await fetch('http://localhost:5001/api/discovery');

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        // Parse the JSON response
        const { data } = await response.json();
        return data; // This contains the filtered users
    } catch (error) {
        console.error('Error fetching filtered users:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


let dummyData = []; // Initialize as an empty array

async function populateUsers() {
    try {
        console.log('Populating users...');
        // Fetch users from the backend
        const users = await fetchFilteredUsersFromBackend();
        console.log('Raw Users:', users);

        // Process and log each user with the desired structure
        const processedUsers = users.map(user => ({
            type: 'profile',
            name: user.name || 'Unknown User',
            username: user.username || 'unknown',
            image: user.image || 'default-pic.jpg',
            compability: user.compatibility || 0,
            topArtists: (user.topArtists || []).map(artist => ({
                name: artist.name || 'Unknown Artist',
                image: artist.image || 'default-artist.jpg',
            })),
            topTracks: (user.topTracks || []).map(track => ({
                name: track.name || 'Unknown Track',
                image: track.image || 'default-track.jpg',
            })),
            topPlaylists: (user.topPlaylists || []).map(playlist => ({
                name: playlist.name || 'Unknown Playlist',
                image: playlist.image || 'default-playlist.jpg',
            })),
            questions: (user.questions || []).map(q => ({
                question: q.question || 'Unknown Question',
                answer: q.answer || 'No Answer',
            })),
        }));

        console.log('Processed Users:', processedUsers);

        // Return the processed users
        return processedUsers;
    } catch (error) {
        console.error('Error populating users:', error);
        return []; // Return an empty array in case of error
    }
}



request.onupgradeneeded = function (event) {
    discoveryDB = event.target.result;

    // Create userData object store
    if (!discoveryDB.objectStoreNames.contains('userData')) {
        const userStore = discoveryDB.createObjectStore('userData', { keyPath: 'id' });
        userStore.createIndex('username', 'username', { unique: false });
        userStore.createIndex('profilePic', 'profilePic', { unique: false });
    }

    // Create chatsData object store
    if (!discoveryDB.objectStoreNames.contains('chatsData')) {
        const chatStore = discoveryDB.createObjectStore('chatsData', { keyPath: 'chatId', autoIncrement: true });
        chatStore.createIndex('isUnread', 'isUnread', { unique: false });
    }

    // Create filterData object store
    if (!discoveryDB.objectStoreNames.contains('filterData')) {
        const filterStore = discoveryDB.createObjectStore('filterData', { keyPath: 'id', autoIncrement: true });
        filterStore.createIndex('type', 'type', { unique: false }); // Type: 'artist', 'track', 'playlist'
    }

    // Create cards object store
    if (!discoveryDB.objectStoreNames.contains('cardsData')) {
        const cardsStore = discoveryDB.createObjectStore('cardsData', { keyPath: 'id', autoIncrement: true });
        cardsStore.createIndex('type', 'type', { unique: false }); // Type: 'artist', 'track', 'playlist'
    }
};

request.onsuccess = function (event) {
    discoveryDB = event.target.result;

    // Load existing data or populate dummy data
    loadUserProfile();
    loadUnreadChatCount();
    loadFilterData();

    populateDummyFilterData();

    
    populateDummyCardsData();

};

request.onerror = function (event) {
    console.error('Database error:', event.target.errorCode);
};

function loadUserProfile() {
    if (!discoveryDB) return;

    const transaction = discoveryDB.transaction(['userData'], 'readonly');
    const objectStore = transaction.objectStore('userData');
    const request = objectStore.get('user');

    request.onsuccess = function (event) {
        const result = event.target.result;
        if (result) {
            if (result.username) {
                document.getElementById('username').textContent = '@' + result.username;
            }
            if (result.profilePic) {
                document.getElementById('profile-pic').src = result.profilePic;
            }
        }
    };

    request.onerror = function (event) {
        console.error('Error loading user data from IndexedDB:', event.target.errorCode);
    };
}

function loadUnreadChatCount() {
    if (!discoveryDB) return;

    const transaction = discoveryDB.transaction(['chatsData'], 'readonly');
    const objectStore = transaction.objectStore('chatsData');
    const request = objectStore.getAll();

    let unreadCount = 0;

    request.onsuccess = (event) => {
        const chats = event.target.result;
        chats.forEach(chat => {
            if (chat.isUnread) {
                unreadCount += 1;
            }
        });

        const unreadCountSpan = document.getElementById('unread-count');
        if (unreadCountSpan) {
            unreadCountSpan.innerText = unreadCount;
        }
    };

    request.onerror = function (event) {
        console.error('Error loading unread chat count:', event.target.errorCode);
    };
}

// Populate dummy data for filterData
async function populateDummyFilterData() {
    if (!discoveryDB) return;

    console.log('Populating dummy filter data...');

    try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.log('Access token not found.');
            return;
        }

        // Construct the API URL with the access token
        const apiUrl = `http://localhost:5001/api/profile?accessToken=${encodeURIComponent(accessToken)}`;

        console.log('Fetching filter data from:', apiUrl);

        // Fetch data from the backend
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile data: ${response.statusText}`);
        }

        const rawData = await response.json();

        console.log('Raw filter data:', rawData);

        const topArtists = JSON.parse(rawData.topArtists || '[]').map(name => ({
            name: name || 'Unknown Artist',
            image: 'default-artist.jpg', // Add default images or fetch them dynamically if available
        }));

        const topTracks = JSON.parse(rawData.topTracks || '[]').map(name => ({
            name: name || 'Unknown Track',
            image: 'default-track.jpg', // Add default images or fetch them dynamically if available
        }));

        const topPlaylists = rawData.topPlaylists || '[]'.map(name => ({
            name: name || 'Unknown Playlist',
            image: 'default-playlist.jpg', // Add default images or fetch them dynamically if available
        }));

        console.log('Parsed and cleaned filter data:', { topArtists, topTracks, topPlaylists });

        // Prepare filter data
        const filterData = [];

        topArtists.forEach(artist => {
            filterData.push({ type: 'artist', name: artist.name, image: artist.image });
        });

        topTracks.forEach(track => {
            filterData.push({ type: 'track', name: track.name, image: track.image });
            console.log('Processed filter data for TRACK:', track);
        });

        topPlaylists.forEach(playlist => {
            filterData.push({ type: 'playlist', name: playlist, image: image });
            console.log('Processed filter data for PLAYLIST:', playlist);
        });

        console.log('Processed filter data for PLAYLIST:', topPlaylists);

        console.log('Processed filter data for IndexedDB:', filterData);

        const transaction = discoveryDB.transaction(['filterData'], 'readwrite');
        const filterStore = transaction.objectStore('filterData');

        // Clear existing filter data in IndexedDB
        filterStore.clear();

        // Add new filter data to IndexedDB
        filterData.forEach(item => {
            filterStore.add(item);
        });

        transaction.oncomplete = function () {
            console.log('Filter data added successfully from backend.');
            loadFilterData();
        };

        transaction.onerror = function (event) {
            console.error('Error adding filter data to IndexedDB:', event.target.errorCode);
        };
    } catch (error) {
        console.log('Error populating dummy filter data:', error);
    }
}

// Populate dummy data for cardsData
async function populateDummyCardsData() {
    if (!discoveryDB) return;

    try {
        // Fetch processed users from populateUsers
        const users = await populateUsers();
        console.log('Users fetched for cards data:', users);

        const cardsData = [];

        // Add tracker object to manage the current profile
        cardsData.push({
            type: 'tracker',
            profile_currently_viewing: users[0]?.username || 'unknown', // Default to the first user or 'unknown'
            profiles_chosen: [],
            profiles_rejected: []
        });

        // Add user profiles
        users.forEach(user => {
            cardsData.push({
                type: 'profile',
                name: user.name || 'Unknown User',
                username: user.username || 'unknown',
                image: user.image || 'default-pic.jpg',
                compability: user.compability || 0,
                topArtists: user.topArtists || [],
                topTracks: user.topTracks || [],
                topPlaylists: user.topPlaylists || [],
                questions: user.questions || [],
            });
        });

        const transaction = discoveryDB.transaction(['cardsData'], 'readwrite');
        const cardsStore = transaction.objectStore('cardsData');

        // Clear existing data
        cardsStore.clear();

        // Add new cards data to IndexedDB
        cardsData.forEach(item => {
            cardsStore.add(item);
        });

        transaction.oncomplete = function () {
            console.log('Cards data added successfully from backend users.');
            loadCardsData();
        };

        transaction.onerror = function (event) {
            console.error('Error adding cards data to IndexedDB:', event.target.errorCode);
        };
    } catch (error) {
        console.error('Error populating dummy cards data:', error);
    }
}


// Load and display cards data
function loadCardsData() {
    if (!discoveryDB) return;

    const transaction = discoveryDB.transaction(['cardsData'], 'readonly');
    const cardsStore = transaction.objectStore('cardsData');
    const request = cardsStore.getAll();

    request.onsuccess = function (event) {
        const items = event.target.result;
        populateActiveCard(items);
    };
}

async function populateActiveCard() {
    try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('Access token not found in local storage.');
        }

        console.log('Fetching all profiles except the current user...');

        // Fetch all users using populateUsers
        const allUsers = await populateUsers();
        console.log('All fetched users:', allUsers);

        // Filter out the current user using the accessToken
        const filteredUsers = allUsers.filter(user => user.accessToken !== accessToken);
        if (!filteredUsers.length) {
            console.log('No other profiles found.');
            return;
        }

        // For simplicity, display the first user in the filtered list
        const profile = filteredUsers[16]; // Replace 0 with the desired index if needed
        console.log('Displaying profile:', profile);

        // Display the profile card
        document.getElementById('profile-name').textContent = profile.name || 'Unknown Name';
        document.getElementById('profile-pfp').src = profile.image || 'default-pfp.jpg';
        document.getElementById('score').textContent = (profile.compability || 0).toString() + '%';

        document.getElementById('user-artists').innerHTML = '';
        (profile.topArtists || []).forEach(artist => {
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = artist.image || 'default-artist.jpg';
            img.alt = artist.name || 'Unknown Artist';
            div.appendChild(img);
            document.getElementById('user-artists').appendChild(div);
        });

        document.getElementById('user-tracks').innerHTML = '';
        (profile.topTracks || []).forEach(track => {
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = track.image || 'default-track.jpg';
            img.alt = track.name || 'Unknown Track';
            div.appendChild(img);
            document.getElementById('user-tracks').appendChild(div);
        });

        document.getElementById('user-playlists').innerHTML = '';
        (profile.topPlaylists || []).forEach(playlist => {
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = playlist.image || 'default-playlist.jpg';
            img.alt = playlist.name || 'Unknown Playlist';
            div.appendChild(img);
            document.getElementById('user-playlists').appendChild(div);
        });

        // Define the predefined prompts with questions
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
        ];

        // Map the personality prompts to predefined questions
        if (profile.personalityPrompts) {
            profile.personalityPrompts.forEach((prompt, index) => {
                if (promptsWithQuestions[index]) {
                    promptsWithQuestions[index].answer = prompt;
                }
            });
        }

        // Display the prompts with questions
        document.getElementById('personality-prompts').innerHTML = '';
        promptsWithQuestions.forEach(({ question, answer }) => {
            const div = document.createElement('div');
            div.classList.add('qa');
            const q = document.createElement('p');
            q.classList.add('question');
            q.textContent = question;
            div.appendChild(q);
            div.appendChild(document.createElement('br'));
            const a = document.createElement('p');
            a.classList.add('answer');
            a.textContent = answer || 'No Answer';
            div.appendChild(a);
            document.getElementById('personality-prompts').appendChild(div);
        });

    } catch (error) {
        console.error('Error populating active card:', error);
    }
}

// Load and display filter data
function loadFilterData() {
    if (!discoveryDB) {
        console.error('IndexedDB is not initialized.');
        return;
    }

    try {
        const transaction = discoveryDB.transaction(['filterData'], 'readonly');
        const filterStore = transaction.objectStore('filterData');
        const request = filterStore.getAll();

        request.onsuccess = function (event) {
            const items = event.target.result || [];

            // Safely process and populate filter sections
            const artists = items.filter(item => item.type === 'artist');
            const tracks = items.filter(item => item.type === 'track');
            const playlists = items.filter(item => item.type === 'playlist');

            populateFilterSection('artist', artists);
            populateFilterSection('track', tracks);
            populateFilterSection('playlist', playlists);

            console.log('Filter data loaded successfully.');
        };

        request.onerror = function (event) {
            console.error('Error loading filter data from IndexedDB:', event.target.errorCode);
        };
    } catch (error) {
        console.error('Unexpected error while loading filter data:', error);
    }
}


// Populate a specific filter section
function populateFilterSection(sectionType, items) {
    const section = document.querySelector(`.filter-section-${sectionType} .filter-items`);
    section.innerHTML = ''; // Clear previous content

    items.forEach(item => {
        // Create filter item as a button
        const filterItem = document.createElement('button');
        filterItem.className = 'filter-item';

        // Create the background layer
        const background = document.createElement('div');
        background.className = 'filter-item-background';
        background.style.backgroundImage = `url(${item.image})`;

        // Create the overlay for the name
        const overlay = document.createElement('div');
        overlay.className = 'filter-item-name';
        overlay.textContent = item.name; // Show the name of the artist, track, or playlist

        // Append the layers to the filter item
        filterItem.appendChild(background);
        filterItem.appendChild(overlay);

        // Add event listener for click to toggle blur state
        filterItem.addEventListener('click', function () {
            const isBlurred = filterItem.classList.toggle('clicked'); // Toggle 'clicked' class
            console.log(`${item.name} was ${isBlurred ? 'selected' : 'deselected'}`);
        });

        section.appendChild(filterItem);
    });
}


// Slider update logic
const slider = document.getElementById('compatibility-slider');
const sliderValue = document.getElementById('slider-value');

slider.addEventListener('input', function () {
    sliderValue.textContent = slider.value + '%';
});

// Event listener for navigation buttons
document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".toggle-button");
    const frontView = document.querySelector(".front-view");
    const backView = document.querySelector(".back-view");
  
    toggleButtons.forEach(button => {
      button.addEventListener("click", () => {
        frontView.classList.toggle("hidden");
        backView.classList.toggle("hidden");
      });
    });
});

document.getElementById('accept-button').addEventListener('click', () => {
    if (!discoveryDB) return;

    // Open a transaction to update the cardsData
    const transaction = discoveryDB.transaction(['cardsData'], 'readwrite');
    const cardsStore = transaction.objectStore('cardsData');

    // Get the tracker object
    const request = cardsStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        const tracker = items.find(item => item.type === 'tracker');

        if (tracker) {
            // Update the profile_currently_viewing to 'anshulsaha'
            tracker.profile_currently_viewing = 'anshulsaha';

            // Save the updated tracker object back to the store
            const updateRequest = cardsStore.put(tracker);

            updateRequest.onsuccess = () => {
                console.log('Profile accepted and updated to anshulsaha');
                loadCardsData(); // Reload the updated data
            };

            updateRequest.onerror = (event) => {
                console.error('Error updating tracker:', event.target.errorCode);
            };
        }
    };

    request.onerror = (event) => {
        console.error('Error fetching tracker data:', event.target.errorCode);
    };
});

// Event listener for "Reject" button
document.getElementById('reject-button').addEventListener('click', () => {
    if (!discoveryDB) return;

    // Open a transaction to update the cardsData
    const transaction = discoveryDB.transaction(['cardsData'], 'readwrite');
    const cardsStore = transaction.objectStore('cardsData');

    // Get the tracker object
    const request = cardsStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        const tracker = items.find(item => item.type === 'tracker');

        if (tracker) {
            // Update the profile_currently_viewing to 'shoubhitravi'
            tracker.profile_currently_viewing = 'shoubhitravi';

            // Save the updated tracker object back to the store
            const updateRequest = cardsStore.put(tracker);

            updateRequest.onsuccess = () => {
                console.log('Profile rejected and updated to shoubhitravi');
                loadCardsData();
            };

            updateRequest.onerror = (event) => {
                console.error('Error updating tracker:', event.target.errorCode);
            };
        }
    };

    request.onerror = (event) => {
        console.error('Error fetching tracker data:', event.target.errorCode);
    };
});
    

// Randomize button functionality
document.getElementById('randomize-btn').addEventListener('click', () => {
    if (!discoveryDB) return;

    const transaction = discoveryDB.transaction(['filterData'], 'readonly');
    const filterStore = transaction.objectStore('filterData');

    const request = filterStore.getAll();

    request.onsuccess = function (event) {
        const items = event.target.result;

        // Separate items by type
        const artists = items.filter(item => item.type === 'artist');
        const tracks = items.filter(item => item.type === 'track');
        const playlists = items.filter(item => item.type === 'playlist');

        // Shuffle each group
        const shuffledArtists = artists.sort(() => Math.random() - 0.5);
        const shuffledTracks = tracks.sort(() => Math.random() - 0.5);
        const shuffledPlaylists = playlists.sort(() => Math.random() - 0.5);

        // Re-populate the filter sections with shuffled data
        populateFilterSection('artist', shuffledArtists);
        populateFilterSection('track', shuffledTracks);
        populateFilterSection('playlist', shuffledPlaylists);

        console.log('Filters have been randomized.');
    };

    request.onerror = function (event) {
        console.error('Error randomizing filters:', event.target.errorCode);
    };

    // Change button color on click
    const randomizeButton = document.getElementById('randomize-btn');
    randomizeButton.style.backgroundColor = '#1aa34a'; // Highlight the button
    setTimeout(() => (randomizeButton.style.backgroundColor = '#535353'), 200); // Reset color after 200ms
});


document.getElementById('reset-btn').addEventListener('click', () => {
    if (!discoveryDB) {
        console.error("IndexedDB is not available.");
        return;
    }

    console.log("Reset button clicked. Resetting filters and reloading data from IndexedDB.");

    console.log("Reloading filter data...");
    loadFilterData();
    console.log("Filter data reloaded.");

    console.log("Reloading cards data...");
    loadCardsData();
    console.log("Cards data reloaded.");

    const slider = document.getElementById('compatibility-slider');
    slider.value = 50;
    document.getElementById('slider-value').textContent = '50%';
    console.log("Compatibility slider reset to 50%.");

    const resetButton = document.getElementById('reset-btn');
    resetButton.style.backgroundColor = '#1aa34a';
    setTimeout(() => (resetButton.style.backgroundColor = '#535353'), 200);
});

// "I'm Feeling Lucky" button functionality
document.getElementById('lucky-btn').addEventListener('click', () => {
    if (!discoveryDB) {
        console.error("IndexedDB is not available.");
        return;
    }

    const transaction = discoveryDB.transaction(['cardsData'], 'readonly');
    const cardsStore = transaction.objectStore('cardsData');

    const request = cardsStore.getAll();

    request.onsuccess = function (event) {
        const items = event.target.result;

        const profiles = items.filter(item => item.type === 'profile');

        if (profiles.length === 0) {
            console.error("No profiles available to display.");
            return;
        }

        const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];

        document.getElementById('profile-name').textContent = randomProfile.name;
        document.getElementById('profile-pfp').src = randomProfile.image;
        document.getElementById('score').textContent = randomProfile.compability.toString() + '%';

        document.getElementById('user-artists').innerHTML = '';
        randomProfile.topArtists.forEach(artist => {
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = artist.image;
            img.alt = artist.name;
            div.appendChild(img);
            document.getElementById('user-artists').appendChild(div);
        });

        document.getElementById('user-tracks').innerHTML = '';
        randomProfile.topTracks.forEach(track => {
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = track.image;
            img.alt = track.name;
            div.appendChild(img);
            document.getElementById('user-tracks').appendChild(div);
        });

        document.getElementById('user-playlists').innerHTML = '';
        randomProfile.topPlaylists.forEach(playlist => {
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = playlist.image;
            img.alt = playlist.name;
            div.appendChild(img);
            document.getElementById('user-playlists').appendChild(div);
        });

        document.getElementById('personality-prompts').innerHTML = '';
        randomProfile.questions.forEach(question => {
            const div = document.createElement('div');
            div.classList.add('qa');
            const q = document.createElement('p');
            q.classList.add('question');
            q.textContent = question.question;
            div.appendChild(q);
            div.appendChild(document.createElement('br'));
            const a = document.createElement('p');
            a.classList.add('answer');
            a.textContent = question.answer;
            div.appendChild(a);
            document.getElementById('personality-prompts').appendChild(div);
        });

        console.log("Random profile displayed:", randomProfile.name);
    };

    request.onerror = function (event) {
        console.error("Error fetching profiles from IndexedDB:", event.target.errorCode);
    };

    const luckyButton = document.getElementById('lucky-btn');
    luckyButton.style.backgroundColor = '#1aa34a'; // Highlight the button
    setTimeout(() => (luckyButton.style.backgroundColor = '#535353'), 200); // Reset color after 200ms
});