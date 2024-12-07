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
