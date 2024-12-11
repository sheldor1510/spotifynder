//using window onload to load all the playlist drop down options fetched from the spotify api
window.onload = async function() {
  //using get data function
  await getData();  // Call the function when the window has loaded
};

document.getElementById('continue-button').addEventListener('click', function() {
  // Save the selected playlists to the database
  saveTopPlaylists();
  // remove hidden from class
  document.getElementById("playlist-form").classList.add('hidden');
  document.getElementById('questionnaire-form').classList.remove('hidden');
});

document.getElementById("submit-responses-button").addEventListener("click", function() {
  // Save the personality prompts to the database
  savePersonalityPrompts();
  // Redirect to the next page
  window.location.reload();
});

getData();

let fetchedPlaylists = [];

//gets the spotify personal playlists for a user
async function getData() {
  //getting the acecess token
  const accessToken = localStorage.getItem("accessToken");  // Get access token from localStorage
  const url = `http://localhost:5001/api/playlists?accessToken=${accessToken}`;  // API URL with access token

  try {
    //waiting to fetch url
    const response = await fetch(url);
    //error handling
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    //turning it into json 
    const json = await response.json();
    console.log(json.playlists);  // Log the fetched data for debugging

    fetchedPlaylists = json.playlists;  // Save the fetched playlists to a global variable

    //populatedropdown function that displays all the personal playlists for a user
    populateDropdowns(json.playlists);  // Populate the dropdowns with playlists

    //error handling
  } catch (error) {
    //console.log for error handling + alert message
    console.error("Error fetching playlists:", error.message);
    // alert("An error occurred while fetching playlists.");
  }
}

//populating the actual playlists
function populateDropdowns(playlists) {
  // Assuming playlists is an array of objects with 'id' and 'name' properties
  const playlistSelects = [
    document.getElementById('playlist-select1'),
    document.getElementById('playlist-select2'),
    document.getElementById('playlist-select3')
  ];

  //doing a for each to display the playlists
  playlistSelects.forEach((selectElement) => {
    // Clear existing options before populating new ones
    selectElement.innerHTML = `<option value="">Select a playlist</option>`;

    playlists.forEach((playlist) => {
      if (playlist != null) {
        const option = document.createElement('option');
        option.value = playlist.name;  // Use the playlist name as the value
        option.textContent = playlist.name;  // Use the playlist name as the option text
        selectElement.appendChild(option);  // Append the new option to the dropdown
      }
    });
  });
}

//saving the playlists to the data base based off of the user's responses
async function saveTopPlaylists() {
  //gettign access token
  const accessToken = localStorage.getItem("accessToken");
  //getting the playlists they chose and saving it to playlistSelects
  const playlistSelects = [
      document.getElementById('playlist-select1').value,
      document.getElementById('playlist-select2').value,
      document.getElementById('playlist-select3').value
  ];

  console.log(playlistSelects);

  localStorage.setItem("playlistSelects", JSON.stringify(playlistSelects));

//saving url
  const url = `http://localhost:5001/api/savePlaylists?accessToken=${accessToken}`;

  let playlistSelectsData = [];

  playlistSelects.forEach((playlist) => {
    const selectedPlaylist = fetchedPlaylists.find((p) => p.name === playlist);
    if (selectedPlaylist) {
      playlistSelectsData.push(selectedPlaylist);
    }
  });
  
  try {
    //sending the post request to save the info to db
      const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          //sending the body back
          body: JSON.stringify({ playlists: playlistSelectsData })
      });

      //success alert message
      const result = await response.json();
      if (result.success) {
          alert("Playlists saved successfully!");
      }
      //error handling
  } catch (error) {
      console.error("Error saving playlists:", error);
      alert("An error occurred while saving playlists.");
  }
}

//function for saving personality prompts from user input
async function savePersonalityPrompts() {
  //getting the access token
  const accessToken = localStorage.getItem("accessToken");
  //saving the prompt answers based off of their id 
  const promptAnswers = [
      document.getElementById('q1').value,
      document.getElementById('q2').value,
      document.getElementById('q3').value
  ];

  //saving the url
  const url = `http://localhost:5001/api/personalityPrompts?accessToken=${accessToken}`;
  
  try {
    //doing the post request for the database
      localStorage.setItem("prompts", JSON.stringify(promptAnswers));

      const response = await fetch(url, {
          method: 'POST',
          //sending it to the body from prompts
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompts: promptAnswers })
      });

      //converting to json
      const result = await response.json();

      //success message
      if (result.success) {
          alert("Prompts saved successfully!");
      }
      //error handling + alert message
  } catch (error) {
      console.error("Error saving prompts:", error);
      // alert("An error occurred while saving prompts.");
  }
}

