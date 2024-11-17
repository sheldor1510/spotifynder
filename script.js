let db;
const request = window.indexedDB.open('SpotifynderDB', 4); // Updated version for new object store

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
};

request.onsuccess = function (event) {
    db = event.target.result;

    // Load existing data or populate dummy data
    loadUserProfile();
    loadUnreadChatCount();
    loadFilterData();

    populateDummyFilterData();
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