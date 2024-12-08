
window.onload = async function() {
  await getData();  // Call the function when the window has loaded
};

async function getData() {
  const accessToken = localStorage.getItem("accessToken");  // Get access token from localStorage
  const url = `http://localhost:3001/api/playlists?accessToken=${accessToken}`;  // API URL with access token

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);  // Log the fetched data for debugging

    populateDropdowns(json);  // Populate the dropdowns with playlists

  } catch (error) {
    console.error("Error fetching playlists:", error.message);
    alert("An error occurred while fetching playlists.");
  }
}

function populateDropdowns(playlists) {
  // Assuming playlists is an array of objects with 'id' and 'name' properties
  const playlistSelects = [
    document.getElementById('playlist-select1'),
    document.getElementById('playlist-select2'),
    document.getElementById('playlist-select3')
  ];

  playlistSelects.forEach((selectElement) => {
    // Clear existing options before populating new ones
    selectElement.innerHTML = `<option value="">Select a playlist</option>`;

    playlists.forEach((playlist) => {
      const option = document.createElement('option');
      option.value = playlist.id;  // Use the playlist ID as the value
      option.textContent = playlist.name;  // Use the playlist name as the option text
      selectElement.appendChild(option);  // Append the new option to the dropdown
    });
  });
}

async function saveTopPlaylists() {
  const accessToken = localStorage.getItem("accessToken");
  const playlistSelects = [
      document.getElementById('playlist-select1'),
      document.getElementById('playlist-select2'),
      document.getElementById('playlist-select3')
  ];


  const url = `http://localhost:3001/api/savedPlaylists?accessToken=${accessToken}`;
  
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ playlists: playlistSelects })
      });


      const result = await response.json();
      if (result.success) {
          alert("Playlists saved successfully!");
      }
  } catch (error) {
      console.error("Error saving playlists:", error);
      alert("An error occurred while saving playlists.");
  }
}

async function savePersonalityPrompts() {
  const accessToken = localStorage.getItem("accessToken");
  const promptAnswers = [
      document.getElementById('q1'),
      document.getElementById('q2'),
      document.getElementById('q3')
  ];


  const url = `http://localhost:3001/api/personalityPrompts?accessToken=${accessToken}`;
  
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ prompts: promptAnswers })
      });


      const result = await response.json();
      if (result.success) {
          alert("Prompts saved successfully!");
      }
  } catch (error) {
      console.error("Error saving prompts:", error);
      alert("An error occurred while saving prompts.");
  }
}

