let db;
const request = window.indexedDB.open('SpotifynderDB', 2); // Incremented version to 2

request.onupgradeneeded = function (event) {
    db = event.target.result;
    console.log("onupgradeneeded triggered. Creating 'userData' object store.");

    // Create the object store for user data if it doesn't exist
    if (!db.objectStoreNames.contains('userData')) {
        const objectStore = db.createObjectStore('userData', { keyPath: 'id' });
        objectStore.createIndex('username', 'username', { unique: false });
        objectStore.createIndex('profilePic', 'profilePic', { unique: false });
        console.log("'userData' object store created.");
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully.");

    // Check if the 'userData' object store exists
    if (!db.objectStoreNames.contains('userData')) {
        console.error("The 'userData' object store was not found. Ensure onupgradeneeded ran successfully.");
        return;
    }

    // Populate the database with dummy data only if the object store exists
    addDummyData();
    loadUserProfile();
};

request.onerror = function (event) {
    console.error('Database error:', event.target.errorCode);
};

// Function to load user profile data from IndexedDB
function loadUserProfile() {
    if (!db) {
        console.error("IndexedDB is not available.");
        return;
    }

    const transaction = db.transaction(['userData'], 'readonly');
    const objectStore = transaction.objectStore('userData');
    const request = objectStore.get('user'); // Assuming the ID of the user is 'user'

    request.onsuccess = function (event) {
        const result = event.target.result;
        if (result) {
            console.log("User data loaded from IndexedDB:", result);

            // Update UI with fetched data
            if (result.username) {
                document.getElementById('username').textContent = '@' + result.username;
            }
            if (result.profilePic) {
                document.getElementById('profile-pic').src = result.profilePic;
            }
        } else {
            console.log("No user data found in IndexedDB.");
        }
    };

    request.onerror = function (event) {
        console.error('Error loading user data from IndexedDB:', event.target.errorCode);
    };
}


function addDummyData() {
    if (!db) {
        console.error("IndexedDB is not available.");
        return;
    }

    const transaction = db.transaction(['userData'], 'readwrite');
    const objectStore = transaction.objectStore('userData');

    const dummyUserData = {
        id: 'user', 
        username: 'avni',
        profilePic: 'sample-pfp.jpeg' 
    };

    const request = objectStore.put(dummyUserData);

    request.onsuccess = function () {
        console.log("Dummy data added to IndexedDB:", dummyUserData);
    };

    request.onerror = function (event) {
        console.error("Error adding dummy data to IndexedDB:", event.target.errorCode);
    };
}
