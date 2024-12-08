//using window onload to load all the playlist drop down options fetched from the spotify api
window.onload = async function() {
  //using get data function
  await getData();  // Call the function when the window has loaded
};

//gets the spotify personal playlists for a user
async function getData() {
  //getting the acecess token
  const accessToken = localStorage.getItem("accessToken");  // Get access token from localStorage
  const url = `http://localhost:3001/api/playlists?accessToken=${accessToken}`;  // API URL with access token

  try {
    //waiting to fetch url
    const response = await fetch(url);
    //error handling
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    //turning it into json 
    const json = await response.json();
    console.log(json);  // Log the fetched data for debugging

    //populatedropdown function that displays all the personal playlists for a user
    populateDropdowns(json);  // Populate the dropdowns with playlists

    //error handling
  } catch (error) {
    //console.log for error handling + alert message
    console.error("Error fetching playlists:", error.message);
    alert("An error occurred while fetching playlists.");
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
      const option = document.createElement('option');
      option.value = playlist.id;  // Use the playlist ID as the value
      option.textContent = playlist.name;  // Use the playlist name as the option text
      selectElement.appendChild(option);  // Append the new option to the dropdown
    });
  });
}

//saving the playlists to the data base based off of the user's responses
async function saveTopPlaylists() {
  //gettign access token
  const accessToken = localStorage.getItem("accessToken");
  //getting the playlists they chose and saving it to playlistSelects
  const playlistSelects = [
      document.getElementById('playlist-select1'),
      document.getElementById('playlist-select2'),
      document.getElementById('playlist-select3')
  ];

//saving url
  const url = `http://localhost:3001/api/savedPlaylists?accessToken=${accessToken}`;
  
  try {
    //sending the post request to save the info to db
      const response = await fetch(url, {
          method: 'POST',
          
          //sending the body back
          body: JSON.stringify({ playlists: playlistSelects })
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
      document.getElementById('q1'),
      document.getElementById('q2'),
      document.getElementById('q3')
  ];

  //saving the url
  const url = `http://localhost:3001/api/personalityPrompts?accessToken=${accessToken}`;
  
  try {
    //doing the post request for the database
      const response = await fetch(url, {
          method: 'POST',
          //sending it to the body from prompts
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
      alert("An error occurred while saving prompts.");
  }
}

