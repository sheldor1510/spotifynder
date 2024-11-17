const dbName = 'userData';
const ver = 1;
let db;
let dbReady = false;  


function openDb() {
  const request = indexedDB.open(dbName, ver);
  request.onupgradeneeded = function (e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains('playlists')) {
      db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('responses')) {
      db.createObjectStore('responses', { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onsuccess = function (e) {
    db = e.target.result;
    dbReady = true; 
    console.log("Database is ready.");
  };
  

  request.onerror = function (e) {
    console.error("Error opening IndexedDB:", e);
  };
}

// Save playlist data to IndexedDB
function savePlayList(one, two, three) {
  const transaction = db.transaction('playlists', 'readwrite');
  const store = transaction.objectStore('playlists');
  
  const playlists = { one, two, three };

  const request = store.add(playlists);

  request.onsuccess = function () {
    console.log("Playlists saved successfully!");
  };

  request.onerror = function (e) {
    console.error("Error saving playlists:", e);
  };
}

// Save questionnaire responses to IndexedDB
function promptQ(q1, q2, q3) {
  const transaction = db.transaction('responses', 'readwrite');
  const store = transaction.objectStore('responses');
  const responses = { q1, q2, q3 };
  const request = store.add(responses);
  request.onerror = function (e) {
    console.error("Error saving responses:", e);
  };
}

// Event listener for page load to initialize the DB
document.addEventListener('DOMContentLoaded', function() {
  openDb();  
  const continueButton = document.getElementById('continue-button');
  const playlistForm = document.getElementById('playlist-form');
  const questionnaireForm = document.getElementById('questionnaire-form');
  
  questionnaireForm.classList.add('hidden');  // Hide the questionnaire form initially
  continueButton.addEventListener('click', function() {

    const playlist1 = document.getElementById('playlist-input1').value;
    const playlist2 = document.getElementById('playlist-input2').value;
    const playlist3 = document.getElementById('playlist-input3').value;
    console.log("Submit button clicked!");

    if (playlist1 && playlist2 && playlist3) {
      savePlayList(playlist1, playlist2, playlist3);
      playlistForm.classList.add('hidden');
      questionnaireForm.classList.remove('hidden');
    } else {
      alert("Please fill out all playlist fields!");
    }
  });

  const submitResponsesButton = document.getElementById('submit-responses-button');
  
  submitResponsesButton.addEventListener('click', function() {
    const q1 = document.getElementById('q1').value;
    const q2 = document.getElementById('q2').value;
    const q3 = document.getElementById('q3').value;

    console.log("Submit button clicked!");
    console.log("q1:", q1, "q2:", q2, "q3:", q3);  // Log responses to make sure values are captured

    if (q1 && q2 && q3) {
      promptQ(q1, q2, q3);  // Save the responses
      window.location.href = '../discovery/discovery.html';  // Redirect to next page  
    } else {
      alert("Please answer all questions!");
    }
  });
});
