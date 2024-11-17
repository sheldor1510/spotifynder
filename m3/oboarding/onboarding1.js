// IndexedDB setup
let db;
const request = indexedDB.open('SpotifynderDB', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const objectStore = db.createObjectStore('userData', { keyPath: 'id' });
  objectStore.createIndex('college', 'college', { unique: false });
  objectStore.createIndex('selectedArtists', 'selectedArtists', { unique: false });
  objectStore.createIndex('selectedTracks', 'selectedTracks', { unique: false });
  console.log("IndexedDB setup complete.");
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("IndexedDB opened successfully.");
  loadUserData(); // Load data when DB is successfully opened
};

request.onerror = function(event) {
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

  request.onsuccess = function(event) {
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

// Dummy Data for Artists and Tracks
const dummyArtists = [
  { name: "Taylor Swift" },
  { name: "Drake" },
  { name: "Ariana Grande" },
  { name: "The Weeknd" },
  { name: "Beyonce" },
  { name: "Ed Sheeran" },
  { name: "Billie Eilish" },
  { name: "Post Malone" },
  { name: "Kanye West" },
  { name: "Dua Lipa" }
];

const dummyTracks = [
  { name: "Top Hits" },
  { name: "Top 10 Hits" },
  { name: "Throwbacks" },
  { name: "Party Mix" },
  { name: "Study Track" },
  { name: "Summer Vibes" },
  { name: "Chill Beats" },
  { name: "Workout Hits" },
  { name: "Road Trip" },
  { name: "Feel Good" }
];

// Event Listeners
spotifyLoginBtn.addEventListener('click', startOnboarding);
saveCollegeBtn.addEventListener('click', saveCollege);
finishBtn.addEventListener('click', finishOnboarding);

function startOnboarding() {
  console.log("Starting onboarding...");
  switchToPage('college-selection');
}

function displayTopArtists() {
  artistsList.innerHTML = '';
  dummyArtists.forEach(artist => {
    const li = document.createElement('li');
    li.textContent = artist.name;
    li.addEventListener('click', () => toggleSelection(li, artist.name, selectedArtists));
    artistsList.appendChild(li);
  });
}

function displayTopTracks() {
  tracksList.innerHTML = '';
  dummyTracks.forEach(track => {
    const li = document.createElement('li');
    li.textContent = track.name;
    li.addEventListener('click', () => toggleSelection(li, track.name, selectedTracks));
    tracksList.appendChild(li);
  });
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
  saveCollegeData(); // Save data after each selection
}

function saveCollegeData() {
  const college = document.getElementById('college-input').value;
  saveData('user', { id: 'user', college, selectedArtists, selectedTracks });
}

function saveCollege() {
  const college = document.getElementById('college-input').value;
  if (college) {
    console.log("Saving college:", college);

    // Move to the next page immediately after calling saveData
    switchToPage('top-info');
    displayTopArtists();
    displayTopTracks();

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
  saveData('user', { id: 'user', college: document.getElementById('college-input').value, selectedArtists, selectedTracks });
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

// Initialize page state to show sign-in page first
switchToPage('sign-in-page');