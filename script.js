
let db;
const request = window.indexedDB.open('SpotifynderDB', 5);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    // Create userData object store
    if (!db.objectStoreNames.contains('userData')) {
        const userStore = db.createObjectStore('userData', { keyPath: 'id' });
        userStore.createIndex('username', 'username', { unique: false });
        userStore.createIndex('profilePic', 'profilePic', { unique: false });
    }

    // Create chatsData object store
    if (!db.objectStoreNames.contains('chatsData')) {
        const chatStore = db.createObjectStore('chatsData', { keyPath: 'chatId', autoIncrement: true });
        chatStore.createIndex('isUnread', 'isUnread', { unique: false });
    }

    // Create filterData object store
    if (!db.objectStoreNames.contains('filterData')) {
        const filterStore = db.createObjectStore('filterData', { keyPath: 'id', autoIncrement: true });
        filterStore.createIndex('type', 'type', { unique: false }); // Type: 'artist', 'track', 'playlist'
    }

    // Create cards object store
    if (!db.objectStoreNames.contains('cardsData')) {
        const cardsStore = db.createObjectStore('cardsData', { keyPath: 'id', autoIncrement: true });
        cardsStore.createIndex('type', 'type', { unique: false }); // Type: 'artist', 'track', 'playlist'
    }
};

request.onsuccess = function (event) {
    db = event.target.result;

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
    if (!db) return;

    const transaction = db.transaction(['userData'], 'readonly');
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

function addDummyData() {
    if (!db) return;

    const userTransaction = db.transaction(['userData'], 'readwrite');
    const userStore = userTransaction.objectStore('userData');
    const dummyUserData = {
        id: 'user',
        username: 'avni',
        profilePic: 'sample-pfp.jpeg'
    };
    userStore.put(dummyUserData);

    const chatTransaction = db.transaction(['chatsData'], 'readwrite');
    const chatStore = chatTransaction.objectStore('chatsData');
    const dummyChats = [
        { isUnread: true, message: "Hello! How are you?" },
        { isUnread: false, message: "Don't forget the meeting tomorrow." },
        { isUnread: true, message: "Can you send me the document?" },
        { isUnread: false, message: "See you soon!" },
        { isUnread: true, message: "Are you coming to the event?" }
    ];
    dummyChats.forEach(chat => {
        chatStore.add(chat);
    });

    userTransaction.oncomplete = function () {
        console.log("Dummy user data added.");
    };
    chatTransaction.oncomplete = function () {
        console.log("Dummy chat data added.");
    };
}

function loadUnreadChatCount() {
    if (!db) return;

    const transaction = db.transaction(['chatsData'], 'readonly');
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
function populateDummyFilterData() {
    if (!db) return;

    const transaction = db.transaction(['filterData'], 'readwrite');
    const filterStore = transaction.objectStore('filterData');

    const dummyData = [
        // Artists
        { type: 'artist', name: 'Artist 1', image: './artist1.jpg' },
        { type: 'artist', name: 'Artist 2', image: './artist2.jpg' },
        { type: 'artist', name: 'Artist 3', image: './artist3.jpg' },
        { type: 'artist', name: 'Artist 4', image: './artist4.jpg' },

        // Tracks
        { type: 'track', name: 'Track 1', image: './track1.jpg' },
        { type: 'track', name: 'Track 2', image: './track2.jpg' },
        { type: 'track', name: 'Track 3', image: './track3.jpg' },
        { type: 'track', name: 'Track 4', image: './track4.jpg' },

        // Playlists
        { type: 'playlist', name: 'Playlist 1', image: './playlist1.jpg' },
        { type: 'playlist', name: 'Playlist 2', image: './playlist2.jpg' },
        { type: 'playlist', name: 'Playlist 3', image: './playlist3.jpg' },
        { type: 'playlist', name: 'Playlist 4', image: './playlist4.jpg' }
    ];

    dummyData.forEach(item => {
        filterStore.add(item);
    });

    transaction.oncomplete = function () {
        console.log('Dummy filter data added successfully.');
        loadFilterData();
    };

    transaction.onerror = function (event) {
        console.error('Error adding dummy data to filterData:', event.target.errorCode);
    };
}

// Populate dummy data for cardsData
function populateDummyCardsData() {
    if (!db) return;

    const transaction = db.transaction(['cardsData'], 'readwrite');
    const cardsStore = transaction.objectStore('cardsData');

    const dummyData = [
        {
            type: 'tracker',
            profile_currently_viewing: 'tanushsavadi',
            profiles_chosen: [],
            profiles_rejected: []
        },
        {
            type: 'profile',
            name: 'Anshul Saha',
            username: 'anshulsaha',
            image: 'https://github.com/sheldor1510.png',
            compability: 90,
            topArtists: [
                { name: 'Artist 1', image: './artist1.jpg' },
                { name: 'Artist 2', image: './artist1.jpg' },
                { name: 'Artist 3', image: './artist1.jpg' }
            ],
            topTracks: [
                { name: 'Track 1', image: './track1.jpg' },
                { name: 'Track 2', image: './track1.jpg' },
                { name: 'Track 3', image: './track1.jpg' }
            ],
            topPlaylists: [
                { name: 'Playlist 1', image: './playlist1.jpg' },
                { name: 'Playlist 2', image: './playlist1.jpg' },
                { name: 'Playlist 3', image: './playlist1.jpg' }
            ],
            questions: [
                { question: 'What is your favorite genre?', answer: 'R&B' },
                { question: 'What is your favorite artist?', answer: 'Kendrick Lamar' },
                { question: 'What is your favorite track?', answer: 'Instant Crush' }
            ]
        },
        {
            type: 'profile',
            name: 'Tanush Savadi',
            username: 'tanushsavadi',
            image: 'https://github.com/tanushsavadi.png',
            compability: 35,
            topArtists: [
                { name: 'Artist 1', image: './artist1.jpg' },
                { name: 'Artist 2', image: './artist1.jpg' },
                { name: 'Artist 3', image: './artist1.jpg' }
            ],
            topTracks: [
                { name: 'Track 1', image: './track1.jpg' },
                { name: 'Track 2', image: './track1.jpg' },
                { name: 'Track 3', image: './track1.jpg' }
            ],
            topPlaylists: [
                { name: 'Playlist 1', image: './playlist1.jpg' },
                { name: 'Playlist 2', image: './playlist1.jpg' },
                { name: 'Playlist 3', image: './playlist1.jpg' }
            ],
            questions: [
                { question: 'What is your go-to playlist?', answer: 'Chill Vibes' },
                { question: 'Which artist do you listen to the most?', answer: 'Taylor Swift' },
                { question: 'What is your current favorite album?', answer: 'After Hours' },
            ]
        },
        {
            type: 'profile',
            name: 'Shoubhit Ravi',
            username: 'shoubhitravi',
            image: 'https://github.com/shoubhitravi.png',
            compability: 75,
            topArtists: [
                { name: 'Artist 1', image: './artist1.jpg' },
                { name: 'Artist 2', image: './artist1.jpg' },
                { name: 'Artist 3', image: './artist1.jpg' }
            ],
            topTracks: [
                { name: 'Track 1', image: './track1.jpg' },
                { name: 'Track 2', image: './track1.jpg' },
                { name: 'Track 3', image: './track1.jpg' }
            ],
            topPlaylists: [
                { name: 'Playlist 1', image: './playlist1.jpg' },
                { name: 'Playlist 2', image: './playlist1.jpg' },
                { name: 'Playlist 3', image: './playlist1.jpg' }
            ],
            questions: [
                { question: 'What is your all-time favorite concert?', answer: 'Coldplay Live 2016' },
                { question: 'Which genre do you listen to when working?', answer: 'Lo-fi Hip Hop' },
                { question: 'What is your favorite music decade?', answer: 'The 80s' },
            ]
        },
    ];

    dummyData.forEach(item => {
        cardsStore.add(item);
    });

    transaction.oncomplete = function () {
        console.log('Dummy cards data added successfully.');
        loadCardsData();
    };

    transaction.onerror = function (event) {
        console.error('Error adding dummy data to cardsData:', event.target.errorCode);
    };
}

// Load and display cards data
function loadCardsData() {
    if (!db) return;

    const transaction = db.transaction(['cardsData'], 'readonly');
    const cardsStore = transaction.objectStore('cardsData');
    const request = cardsStore.getAll();

    request.onsuccess = function (event) {
        const items = event.target.result;
        populateActiveCard(items);
    };
}

function populateActiveCard(items) {
    const tracker = items.filter(item => item.type === 'tracker')[0];
    const profile = items.filter(item => item.username === tracker.profile_currently_viewing)[0];

    // Display the profile card
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-pfp').src = profile.image;
    document.getElementById('score').textContent = profile.compability.toString() + '%';

    document.getElementById('user-artists').innerHTML = '';
    profile.topArtists.forEach(artist => {
        const div = document.createElement('div');
        div.classList.add('artist');
        const img = document.createElement('img');
        img.src = artist.image;
        img.alt = artist.name;
        div.appendChild(img);
        document.getElementById('user-artists').appendChild(div);
    });

    document.getElementById('user-tracks').innerHTML = '';
    profile.topTracks.forEach(track => {
        const div = document.createElement('div');
        div.classList.add('artist');
        const img = document.createElement('img');
        img.src = track.image;
        img.alt = track.name;
        div.appendChild(img);
        document.getElementById('user-tracks').appendChild(div);
    });

    document.getElementById('user-playlists').innerHTML = '';
    profile.topPlaylists.forEach(playlist => {
        const div = document.createElement('div');
        div.classList.add('artist');
        const img = document.createElement('img');
        img.src = playlist.image;
        img.alt = playlist.name;
        div.appendChild(img);
        document.getElementById('user-playlists').appendChild(div);
    });

    document.getElementById('personality-prompts').innerHTML = '';
    profile.questions.forEach(question => {
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
}

// Load and display filter data
function loadFilterData() {
    if (!db) return;

    const transaction = db.transaction(['filterData'], 'readonly');
    const filterStore = transaction.objectStore('filterData');
    const request = filterStore.getAll();

    request.onsuccess = function (event) {
        const items = event.target.result;

        populateFilterSection('artist', items.filter(item => item.type === 'artist'));
        populateFilterSection('track', items.filter(item => item.type === 'track'));
        populateFilterSection('playlist', items.filter(item => item.type === 'playlist'));
    };

    request.onerror = function (event) {
        console.error('Error loading filter data:', event.target.errorCode);
    };
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
    if (!db) return;

    // Open a transaction to update the cardsData
    const transaction = db.transaction(['cardsData'], 'readwrite');
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
    if (!db) return;

    // Open a transaction to update the cardsData
    const transaction = db.transaction(['cardsData'], 'readwrite');
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
    if (!db) return;

    const transaction = db.transaction(['filterData'], 'readonly');
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
    if (!db) {
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




