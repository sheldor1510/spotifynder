// IndexedDB setup
let db;
const request = indexedDB.open('SpotifynderDB', 1);

const slider = document.getElementById('compatibility-slider');
const sliderValue = document.getElementById('slider-value');

    // Add event listener to update the displayed value as the slider moves
    slider.addEventListener('input', function() {
        sliderValue.textContent = slider.value + '%';
    });

request.onupgradeneeded = function (event) {
  db = event.target.result;

  // Create the object store for user data
  const objectStore = db.createObjectStore('userData', { keyPath: 'id' });
  objectStore.createIndex('username', 'username', { unique: false });
  objectStore.createIndex('profilePic', 'profilePic', { unique: false });
  console.log("IndexedDB setup complete.");
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("IndexedDB opened successfully.");
  loadUserProfile(); // Load user profile on success
};

request.onerror = function (event) {
  console.error('Database error:', event.target.errorCode);
};

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
          document.getElementById('username-display').textContent = result.username;
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

  function saveUserData(username, profilePic) {
    if (!db) {
      console.error("IndexedDB is not available.");
      return;
    }
  
    const transaction = db.transaction(['userData'], 'readwrite');
    const objectStore = transaction.objectStore('userData');
  
    const userData = {
      id: 'user', // Assuming a single-user setup
      username,
      profilePic
    };
  
    const request = objectStore.put(userData);
  
    request.onsuccess = function () {
      console.log(`User data saved: ${JSON.stringify(userData)}`);
    };
  
    request.onerror = function (event) {
      console.error('Error saving user data to IndexedDB:', event.target.errorCode);
    };
  }