
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

async function apiRequest(url, method = 'GET', headers = {}, body = null) {
    const apiURL = 'http://localhost:5001' + url
    const response = await fetch(apiURL, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
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
            image: user.image || 'sample-pfp.jpeg',
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

let filterData = [];

// Populate dummy data for filterData
async function populateDummyFilterData() {
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

        const topArtists = JSON.parse(rawData.topArtists || '[]')

        const topTracks = JSON.parse(rawData.topTracks || '[]')

        const topPlaylists = rawData.topPlaylists || '[]'

        console.log('Parsed and cleaned filter data:', { topArtists, topTracks, topPlaylists });

        topArtists.forEach(artist => {
            filterData.push({ type: 'artist', name: artist.name, image: artist.imageUrl });
        });

        topTracks.forEach(track => {
            filterData.push({ type: 'track', name: track.name, image: track.albumImageUrl });
        });

        topPlaylists.forEach(playlist => {
            filterData.push({ type: 'playlist', name: playlist.name, image: playlist.images[0].url });
        });

        loadFilterData();
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
                image: user.image || 'sample-pfp.jpeg',
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
        const profile = filteredUsers[2]; // Replace 0 with the desired index if needed
        console.log('Displaying profile:', profile);

        // Display the profile card
        document.getElementById('profile-name').textContent = profile.name || 'Unknown Name';
        document.getElementById('profile-pfp').src = profile.image || 'sample-pfp.jpeg';
        document.getElementById('score').textContent = (profile.compability || (Math.random() * 100).toFixed(0)).toString() + '%';

        document.getElementById('user-artists').innerHTML = '';
        (profile.topArtists || []).forEach(artist => {
            const artistToDisplay = artist.name;
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = artistToDisplay.imageUrl || 'default-artist.jpg';
            img.alt = artistToDisplay.name || 'Unknown Artist';
            div.appendChild(img);
            document.getElementById('user-artists').appendChild(div);
        });

        document.getElementById('user-tracks').innerHTML = '';
        (profile.topTracks || []).forEach(track => {
            const trackToDisplay = track.name;
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = trackToDisplay.albumImageUrl || 'default-track.jpg';
            img.alt = trackToDisplay.name || 'Unknown Track';
            div.appendChild(img);
            document.getElementById('user-tracks').appendChild(div);
        });

        document.getElementById('user-playlists').innerHTML = '';
        (profile.topPlaylists || []).forEach(playlist => {
            const playlistToDisplay = playlist.name;
            const div = document.createElement('div');
            div.classList.add('artist');
            const img = document.createElement('img');
            img.src = playlistToDisplay.images[0].url || 'default-playlist.jpg';
            img.alt = playlistToDisplay.name || 'Unknown Playlist';
            div.appendChild(img);
            document.getElementById('user-playlists').appendChild(div);
        });

        // Display the prompts with questions
        document.getElementById('personality-prompts').innerHTML = '';
        profile.questions.forEach(({ question, answer }) => {
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
    console.log("filter data in gloabl state", filterData);
    populateFilterSection('artist', filterData.filter(item => item.type === 'artist'));
    populateFilterSection('track', filterData.filter(item => item.type === 'track'));
    populateFilterSection('playlist', filterData.filter(item => item.type === 'playlist'));
    // console.log(artists, tracks, playlists);
    // populateFilterSection('artist', artists);
    // populateFilterSection('track', tracks);
    // populateFilterSection('playlist', playlists);
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

document.getElementById('accept-button').addEventListener('click', async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.log('Access token not found.');
        return;
    }

    // Retrieve the requestorId from the tracker object
    let requestorId = '';
    const transaction = discoveryDB.transaction(['cardsData'], 'readwrite');
    const cardsStore = transaction.objectStore('cardsData');
    const request = cardsStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        const tracker = items.find(item => item.type === 'tracker');

        if (tracker) {
            requestorId = tracker.profile_currently_viewing;
        }

        console.log('Requestor ID:', requestorId);
    }

    // Construct the API URL with the access token and requestorId
    const apiUrl = `/api/requests/accept?accessToken=${accessToken}&requestorId=${requestorId}`;

    const response = await apiRequest(apiUrl, 'POST');

    if (response.success) {
        console.log('Request accepted successfully.');
    } else {
        console.error('Error accepting request:', response.error);
    }
});

// Event listener for "Reject" button
document.getElementById('reject-button').addEventListener('click', async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.log('Access token not found.');
        return;
    }

    // Retrieve the requestorId from the tracker object
    let requestorId = '';
    const transaction = discoveryDB.transaction(['cardsData'], 'readwrite');
    const cardsStore = transaction.objectStore('cardsData');
    const request = cardsStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        const tracker = items.find(item => item.type === 'tracker');

        if (tracker) {
            requestorId = tracker.profile_currently_viewing;
        }

        console.log('Requestor ID:', requestorId);
    }

    // Construct the API URL with the access token and requestorId
    const apiUrl = `/api/requests/reject?accessToken=${accessToken}&requestorId=${requestorId}`;

    const response = await apiRequest(apiUrl, 'POST');

    if (response.success) {
        console.log('Request rejected successfully.');
    } else {
        console.error('Error rejecting request:', response.error);
    }
});
    

// Randomize button functionality
document.getElementById('randomize-btn').addEventListener('click', () => {
    populateDummyCardsData();
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