// IndexedDB setup
// let db;
// const request = indexedDB.open('SpotifynderDB', 1);

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
  console.log(data)
  // TODO: Send request to backend to save data for onboarding
  // if (!db) {
  //   console.error("IndexedDB is not available.");
  //   return;
  // }
  
  // const transaction = db.transaction(['userData'], 'readwrite');
  // const objectStore = transaction.objectStore('userData');
  // const request = objectStore.put({ id, ...data });
  // request.onsuccess = () => {
  //   console.log(`Data saved to IndexedDB: ${JSON.stringify(data)}`);
  // };
  // request.onerror = (event) => {
  //   console.error('Error saving data to IndexedDB:', event.target.errorCode);
  // };
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

// Function to start onboarding
function startOnboarding() {
  console.log("Starting onboarding...");
  switchToPage('college-selection');
}

// Display top artists list
function displayTopArtists() {
  artistsList.innerHTML = '';
  dummyArtists.forEach(artist => {
    const li = document.createElement('li');
    li.textContent = artist.name;
    li.addEventListener('click', () => toggleSelection(li, artist.name, selectedArtists));
    artistsList.appendChild(li);
  });
}

// Display top tracks list
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

// Save college and selected data
function saveCollegeData() {
  const college = document.getElementById('college-input').value;
  saveData('user', { id: 'user', college, selectedArtists, selectedTracks });
}

// Save college information to IndexedDB
function saveCollege() {
  const college = document.getElementById('college-input').value;
  if (college) {
    console.log("Saving college:", college);
    switchToPage('top-info');
    displayTopArtists();
    displayTopTracks();
    saveData('user', { id: 'user', college, selectedArtists, selectedTracks });
  } else {
    alert('Please enter your college name.');
  }
}

// Finish onboarding and save all data
function finishOnboarding() {
  if (selectedArtists.length === 0 || selectedTracks.length === 0) {
    alert('Please select at least one artist and one track.');
    return;
  }
  saveData('user', { id: 'user', college: document.getElementById('college-input').value, selectedArtists, selectedTracks });
  console.log("Onboarding complete with data saved to IndexedDB.");
  document.getElementById("onboarding1").style.display = "none";
  document.getElementById("onboarding2").style.display = "block";
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

// Spotify Login Flow

// Spotify Client ID and Redirect URI (replace with your credentials)
const clientId = '73234712981648089924a4efa5774a7f';  // Replace with your Spotify Client ID
const redirectUri = 'http://localhost:5001/api/auth/spotify/callback';  // Replace with your redirect URI
const scopes = 'user-library-read user-top-read user-read-email playlist-read-private';  // Specify the scopes you need
const responseType = 'code';  // Spotify OAuth response type

// Redirect to Spotify's authorization page
function handleSpotifyLogin() {
  console.log("here")
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=${responseType}`;
  window.open(authUrl, '_blank')
}

document.getElementById('spotify-login-btn').addEventListener('click', handleSpotifyLogin);

// After Spotify redirects back, handle the authorization code
function handleSpotifyCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    fetchAccessToken(code);
  }
}

// Fetch the access token using the authorization code
function fetchAccessToken(code) {
  const clientSecret = '289cc0430b1e4086b1f410b221c86582';  // Replace with your Spotify Client Secret

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', code);
  body.append('redirect_uri', redirectUri);
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);

  fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      localStorage.setItem('spotify_access_token', data.access_token);
      window.location.href = '/dashboard';  // Redirect to dashboard after login
    } else {
      console.error('Failed to obtain access token');
    }
  })
  .catch(error => {
    console.error('Error fetching access token:', error);
  });
}

if (window.location.pathname === '/callback') {
  handleSpotifyCallback();
}

// Assuming colleges.json is placed in the public directory or accessible path

// Fetch colleges.json once at the start
fetch('http://localhost:5001/api/colleges')  // Assuming your backend runs on port 5001
  .then(response => response.json())
  .then(colleges => {
    const collegeSelect = document.getElementById('college-select');
    collegeSelect.innerHTML = '<option value="">Select your college</option>'; // Clear existing options
    
    colleges.forEach(college => {
      const option = document.createElement('option');
      option.value = college.name;  // Assuming each college object has a 'name' property
      option.textContent = college.name;
      collegeSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error loading colleges from backend:', error);
  });

// Save the selected college when the user clicks the Save College button
document.getElementById('save-college-btn').addEventListener('click', function() {
  const selectedCollege = document.getElementById('college-input').value;

  if (selectedCollege) {
    console.log('Saving college:', selectedCollege);
    // Implement the logic to save the selected college to the database or IndexedDB
    // e.g., saveCollegeData(selectedCollege);
  } else {
    alert('Please select a college.');
  }
});
