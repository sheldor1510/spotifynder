// IndexedDB setup
let db;
const request = indexedDB.open('SpotifynderDB', 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const objectStore = db.createObjectStore('userData', { keyPath: 'id' });
  objectStore.createIndex('college', 'college', { unique: false });
  objectStore.createIndex('selectedArtists', 'selectedArtists', { unique: false });
  objectStore.createIndex('selectedTracks', 'selectedTracks', { unique: false });
  console.log("IndexedDB setup complete.");
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("IndexedDB opened successfully.");
  loadUserData(); // Load data when DB is successfully opened
};

request.onerror = function (event) {
  console.error('Database error:', event.target.errorCode);
};

// Helper functions for IndexedDB operations
function saveData(id, data) {
  if (!db) {
    console.error("IndexedDB is not available.");
    return;
  }

  const transaction = db.transaction(['userData'], 'readwrite');
  const objectStore = transaction.objectStore('userData');
  const request = objectStore.put({ id, ...data });

  request.onsuccess = () => {
    console.log(`Data saved to IndexedDB: ${JSON.stringify(data)}`);
  };

  request.onerror = (event) => {
    console.error('Error saving data to IndexedDB:', event.target.errorCode);
  };
}

function loadUserData() {
  if (!db) {
    console.error("IndexedDB is not available.");
    return;
  }

  const transaction = db.transaction(['userData'], 'readonly');
  const objectStore = transaction.objectStore('userData');
  const request = objectStore.get('user');

  request.onsuccess = function (event) {
    const result = event.target.result;
    if (result) {
      console.log("Data loaded from IndexedDB:", result);
      if (result.college) {
        document.getElementById('college-input').value = result.college;
      }
      if (result.selectedArtists) {
        selectedArtists = result.selectedArtists;
      }
      if (result.selectedTracks) {
        selectedTracks = result.selectedTracks;
      }
    }
  };

  request.onerror = (event) => {
    console.error('Error loading data from IndexedDB:', event.target.errorCode);
  };
}

// DOM Elements and Initialization
const signInPage = document.getElementById('sign-in-page');
const collegeSelectionPage = document.getElementById('college-selection');
const topInfoPage = document.getElementById('top-info');
const spotifyLoginBtn = document.getElementById('spotify-login-btn');
const saveCollegeBtn = document.getElementById('save-college-btn');
const finishBtn = document.getElementById('finish-btn');
const artistsList = document.getElementById('artists-list');
const tracksList = document.getElementById('tracks-list');

// Selection arrays to store chosen items
let selectedArtists = [];
let selectedTracks = [];

// Event Listeners
spotifyLoginBtn.addEventListener('click', startOnboarding);
saveCollegeBtn.addEventListener('click', saveCollege);
finishBtn.addEventListener('click', finishOnboarding);

function startOnboarding() {
  console.log("Starting onboarding...");
  window.location.href = 'http://localhost:5001/auth/spotify'; // Redirect to Spotify login
}

function fetchColleges() {
  fetch('http://localhost:5001/colleges')
    .then(response => response.json())
    .then(colleges => {
      const collegeInput = document.getElementById('college-input');
      colleges.forEach(college => {
        const option = document.createElement('option');
        option.value = college.name;
        option.textContent = college.name;
        collegeInput.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching colleges:', error));
}

function fetchTopSpotifyData() {
  fetch('http://localhost:5001/user/top-data')
    .then(response => response.json())
    .then(data => {
      displayTopArtists(data.topArtists);
      displayTopTracks(data.topTracks);
    })
    .catch(error => console.error('Error fetching Spotify data:', error));
}

function displayTopArtists(topArtists) {
  artistsList.innerHTML = '';
  topArtists.forEach(artist => {
    const li = document.createElement('li');
    li.textContent = artist;
    li.addEventListener('click', () => toggleSelection(li, artist, selectedArtists));
    artistsList.appendChild(li);
  });
}

function displayTopTracks(topTracks) {
  tracksList.innerHTML = '';
  topTracks.forEach(track => {
    const li = document.createElement('li');
    li.textContent = track;
    li.addEventListener('click', () => toggleSelection(li, track, selectedTracks));
    tracksList.appendChild(li);
  });
}

// Toggle selection of an item, limit to max 3 selections
// Function to show the "Saved" popup
function showSavedMessage() {
  const savedMessage = document.getElementById('saved-message');
  savedMessage.classList.add('show');

  // Hide the popup after 2 seconds
  setTimeout(() => {
    savedMessage.classList.remove('show');
  }, 2000);
}

// Toggle selection of an item, limit to max 3 selections
function toggleSelection(element, name, selectedArray) {
  if (selectedArray.includes(name)) {
    selectedArray.splice(selectedArray.indexOf(name), 1);
    element.classList.remove('selected');
  } else if (selectedArray.length < 3) {
    selectedArray.push(name);
    element.classList.add('selected');
  } else {
    alert('You can select a maximum of 3 items.');
  }
  
  // Show "Saved" message after selection
  showSavedMessage();
  saveCollegeData(); // Save data after each selection
}


function saveCollegeData() {
  const college = document.getElementById('college-input').value;
  const data = { college, selectedArtists, selectedTracks };

  // Save to Backend
  fetch('http://localhost:5001/user/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(() => console.log('Data saved to backend:', data))
    .catch(error => console.error('Error saving data to backend:', error));
}

function saveCollege() {
  const college = document.getElementById('college-input').value;
  if (college) {
    console.log("Saving college:", college);

    // Move to the next page immediately after calling saveData
    switchToPage('top-info');
    fetchTopSpotifyData();

    // Save college to IndexedDB asynchronously
    saveData('user', { id: 'user', college, selectedArtists, selectedTracks });
  } else {
    alert('Please enter your college name.');
  }
}

function finishOnboarding() {
  if (selectedArtists.length === 0 || selectedTracks.length === 0) {
    alert('Please select at least one artist and one track.');
    return;
  }
  saveCollegeData();
  alert('Onboarding Complete!');
  console.log("Onboarding complete with data saved to IndexedDB.");
}

// Switch between pages
function switchToPage(pageId) {
  console.log(`Switching to page: ${pageId}`);
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  document.getElementById(pageId).classList.remove('hidden');
}

// Initialize page state
switchToPage('sign-in-page');
fetchColleges();
