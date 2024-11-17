
Onboarding Feature Part 1: 
A user will be able to sign into our dashboard/web app, using their spotify credentials. This feature will also allow a user to select their top artists and tracks. Their top artists and tracks will allow Spotifynder to better match uses with potential matches. This feature will involve utilizing the spotify api to pull important information from a user’s spotify account.  By integrating this functionality, we not only simplify the login process but also leverage the wealth of data available through the Spotify API to enhance user engagement. A user will also add in their college so they can connect within their community.

Feature Breakdown:

        Overview  
        The onboarding1 feature of Spotifynder guides users through a multi-step setup process. The steps include:

        1. Signing in with Spotify (simulated button)
        2. Selecting a college
        3. Choosing top artists and tracks  

        Data is stored in `IndexedDB` to ensure session persistence, allowing users to return to their selections if they reload or revisit the app. The design 
        focuses on responsiveness and a user-friendly interface.

        Features

        1. Sign-in and College Selection (5 points - Large Feature)
        - Description: The first step is signing in with Spotify. After authentication, users are prompted to enter the name of their college. 
        Both actions are combined into one feature to streamline the process. The data for both Spotify login and selected college is stored in `IndexedDB` 
        to allow persistence across sessions.
        - Purpose: Combines two initial onboarding steps (sign-in and college selection) into a seamless experience.
        - IndexedDB: Stores the user's Spotify account details and selected college.
        - Points: 5 points (Large feature)

        2. Top Artists and Tracks Selection (3 points - Medium Feature)
        - Description: Allows users to select up to three artists and three tracks from a predefined list. Selections are visually highlighted, 
        and data is stored in `IndexedDB`. The feature includes a scrolling option in case the list exceeds the viewport size.
        - Purpose: Gathers information on music preferences to improve matchmaking.
        - IndexedDB: Stores selected artists and tracks.
        - Points: 3 points (Medium feature)

        3. Finish Button and Completion (2 points - Medium Feature)
        - Description: Finalizes the onboarding process, confirming that all selected data is saved. Users are notified of completion and can proceed to the 
        main application. The button ensures that the user’s selections are persisted.
        - Purpose: Provides a clear end to onboarding and prepares the user for the main application.
        - IndexedDB: Ensures all data is saved before completion.
        - Points: 2 points (Medium feature)

        4. Responsive Design and Styling (2 points - Medium Feature)
        - Description: Responsive CSS ensures usability across devices, with media queries for optimal layout on various screen sizes. 
        Focuses on making the interface adaptable to all screen sizes, ensuring a consistent user experience.
        - Purpose: Enhances user experience by making the interface adaptable.
        - Points: 2 points (Medium feature)

        Total Points: 12


Assigned to: Priyal Nanda

Onboarding Feature Part 2: 
This feature is a part two of the onboarding process. Users will now be able to add in their personal playlists from spotify. This information will further make it easier for Spotifynder to find the perfect match ups for users, as it takes into account a user’s unique music taste and preferences. The onboarding process will also include multiple unique questions that a user will answer and display on their profile. These questions allow a user to have more versatility in what they want their profile to display and also it will include their own answers, making their profile more individualized.

Feature Breakdown:

        Playlist Input and Data Handling (Large Feature – 5 points)
            1. Playlist Form:
                Purpose: Allow users to input details for three playlists and ensure this data is collected for further use.
                Input fields for three playlists. These playlists will be from the spotify API and be pulled into Spotifynder
                User submits data, and it gets stored in IndexedDB. (2 points)
            2. Database Integration:
                Purpose: Persist playlist data in a reliable storage system to ensure it's available for later use.
                Store the playlists in an IndexedDB object store. (2 points)
            3. Dynamic UI Updates:
               Purpose: Enhance user experience by transitioning smoothly from one form to the next.
                Switch from playlist form to questionnaire form after submission. (1 point)

        Questionnaire (Medium Feature – 3 points)
            1. Questionnaire Form:
                Purpose: Collect user responses dynamically for analysis or retrieval later.
                Dynamic form with three text fields for user responses. (2 points)
            2. Save Responses:
                Purpose: Ensure user responses are securely saved for later retrieval and further processing.
                Store responses in IndexedDB for later retrieval. (1 point)

        Data Validation and Error Handling (Small Feature – 1 point)
            1. Input Validation:
                Purpose: Prevent incomplete submissions and guide users to fill all fields, improving data accuracy.
                Ensure that users fill all fields before proceeding to the next step.
                If users don’t, they are given an error message prompting them to fill out all the fields. (1 point)

        IndexedDB Integration (Medium Feature – 3 points)
            1. Create Object Stores:
                Purpose: Organize and manage data effectively by setting up dedicated stores for playlists and responses.
                Set up playlists and responses object stores in IndexedDB. (2 points)
            2. Saving Data:
                Purpose: Ensure data is reliably persisted in the database upon form submission for later access.
                Save playlists and responses to the database when the user submits their form. (1 point)

        Total Points: 5 + 3 + 1 + 3 = 12

Assigned to: Nehal Garg

Discovery Page Feature: 
The discovery page includes multiple filters for a user. One of the filters Spotifynder will include is a filter by college. This makes it really easy for a user to find people from the same college town vicinity as them. By allowing users to filter by college, Spotifynder creates a more personalized experience, increasing the likelihood of users spending more time on the platform and engaging with others. Many college students are in a new environment, often away from their hometowns. The college filter allows users to find and connect with others who share a similar background or current academic environment, fostering community and friendship. Furthermore, the discovery page will include filters that the user can personalize for themselves. If a user really thinks having the same artist preferences as another Spotifynder user is important to them, they can emphasize on their profile that they want their feed to be filtered by similar music artist preference. This feature is really tailored towards our audience because we want to make sure they get the best matches possible based on factors that are vital to their connections. Spotifyner also has a filter by playlists and filter by track implementation.

Feature Breakdown:

        Tanush (6+4+2 pts)
        2(a) Filters UI Component with Dummy Data (6 pts)
            Description:
            Three separate filter sections:
            Artists
            Tracks
            Playlists
            Each section dynamically updates based on IndexedDB-stored data.
            Purpose:
            Allows users to fine-tune matchmaking by filtering preferences.
            Ensures data is presented interactively and dynamically.
            IndexedDB:
            Fetches and displays all filter data dynamically from the database.

        2(b) Fetching Artists, Tracks, and Playlists from IndexedDB (Included in 6 pts)
            Description:
            Retrieves data for artists, tracks, and playlists dynamically to populate filter sections.
            Purpose:
            Ensures real-time synchronization of IndexedDB data with the UI.

        3(b) Accept and Reject Buttons (4 pts)
            Description:
            Accept Button: Updates user preferences in IndexedDB by marking liked profiles.
            Reject Button: Updates IndexedDB by recording disliked profiles.
            Both buttons dynamically refresh the displayed cards above based on the interaction.
            Purpose:
            Builds the user's taste profile for future recommendations.
            Enables dynamic updates to the card view based on preferences.



Assigned to: Tanush

Matching Feature Part 1: 
The matching feature is what creates the actual matches in Spotifynder. A user can accept or reject people who have recently liked their profile. An acceptance on both sides would result in a user finding a new match, which is great for them! When a user receives a like, they can view the profile of the person who liked them. This includes their profile picture, bio, interests, and college affiliation. Users can easily accept or reject likes with a simple interface, such as a swipe or button. If both users accept each other, they are notified of the match, enabling them to connect further. If one or both users reject the like, they can continue exploring other profiles without losing the opportunity for future connections.

Feature Breakdown:
        Avni (3+4+3+2+2 pts)
        1(a) User Profile Pic and Username Fetched from IndexedDB (3 pts)
            Description:
            Fetches and displays the user's profile picture and username on the sidebar.
            Updates dynamically if the database changes.
            Purpose:
            Ensures the UI always reflects the current user’s data.
            Provides personalization and consistency.
            IndexedDB:
            Retrieves user data stored in the database.

        1(a) User Profile Pic and Username Fetched from IndexedDB (3 pts)
            Description:
            Fetches and displays the user's profile picture and username on the sidebar.
            Updates dynamically if the database changes.
            Purpose:
            Ensures the UI always reflects the current user’s data.
            Provides personalization and consistency.
            IndexedDB:
            Retrieves user data stored in the database.

        1(b) Four Interaction Nav Buttons (4 pts (1+1+1+1))
            Description:
            Buttons: Discovery, Chats, Profile, Logout.
            3 buttons update the main view based on user selection.
            Logout button changes upon hovering
            Purpose:
            Provides intuitive navigation between app sections.

        2(c) Randomize Button (3 pts)
            Description:
            Uses IndexedDB data to shuffle and randomize filters dynamically.
            Updates UI with the new randomized data.
            Purpose:
            Introduces an element of unpredictability while exploring content.
            Encourages experimentation with filters.

        2(d) Reset Filters and Refresh Cards (2 pts)
            Description:
            Resets all filters to their default state.
            Refreshes the displayed cards to reflect the reset.
            Purpose:
            Provides a quick way to start over without manual adjustments.
            IndexedDB:
            Ensures a smooth reset by restoring the default data state.

        1(c) Unread Chats Counter (2 pts)
            Description:
            Fetches the number of unread chats from IndexedDB.
            Displays the count dynamically beside the Chats navigation button.
            Purpose:
            Keeps users updated on pending chats.
            IndexedDB:
            Synchronizes the count with IndexedDB to ensure real-time accuracy.



Assigned to: Avni

Matching Feature Part 2: In addition to mutual likes, users can actively select profiles that interest them from their feed. Users can scroll through a curated feed of profiles, featuring users who align with their interests and preferences. This feature allows users to take control of their matching experience, selecting individuals they find appealing based on personal criteria. By enabling users to browse through a wider array of profiles, Spotifynder increases the diversity of potential matches, encouraging connections beyond initial likes.

Feature Breakdown:

        Anshul (10+2 pts)
        3(a) User Profile Card Component - Front and Back Views (10 pts)
            Description:
            The front view showcases user information:
            Profile picture
            Username
            Compatibility score
            Top 3 artists, tracks, and playlists fetched from IndexedDB.
            The back view contains personality prompts with Q&A cards.
            All the displayed data dynamically updates based on changes made via filters or interactions. IndexedDB persists these updates.
            Purpose:
            Provides a detailed profile view, integrating all key information.
            Enhances engagement by including interactive personality prompts on the back view.
            IndexedDB:
            Stores user profile data, top artists, tracks, playlists, and personality Q&A responses.
            Updates dynamically based on user interactions or filter changes.

        3(c) I'm Feeling Lucky Button (2 pts)
            Description:
            Displays a completely random profile, bypassing filters or previous interactions.
            Updates IndexedDB with the selected profile as a "viewed" profile.
            Purpose:
            Adds a fun, unpredictable element to the experience.
            Allows users to explore random profiles outside their defined preferences.
            IndexedDB:
            Ensures the randomly selected profile is marked as "viewed" for potential future algorithm use.



Assigned to: Anshul

Chat Feature: 
This feature is crucial to the effectiveness of Spotifynder. The ability for users to chat with their matches is what will allow them to create meaningful connections and friendships. After a user gets a match they have the opportunity to engage in conversation with their match. By enabling communication, the chat feature helps users get to know each other better, fostering relationships based on shared interests and experiences.

Feature Breakdown:

        Approved user and Requested User Handling (Large feature 5 points)
        Approved user: clicking on an approved user (top of the chat list) will take you to a messaging page where you can have your own personal chats with each person. 
        Requested user: clicking on a requested user will take you to their profile where their unique albums playlists etc will show up. 
        Dynamic: each page for each person is different The page is personalized to their conversations or profiles
        Saved text conversations (Medium feature 3 points)
        Indexeddb: Indexeddb is used to save conversations that are had by an approved user and yourself. 
        Saving: Even when the user goes to another user chat and comes back, the messages will be saved. 

        Accept and decline buttons (2 small features - 2 points) 
        Accept button: created the accept button to accept a profile (minimum interaction / basic feature) 
        Decline button: Same as above but to decline a friend. 

        Message sender (medium feature - 2 points) 
        Ability to send a message: bar at the bottom to type and send a message. 
        Styling: this is done so that received texts are gray and on the left and sent texts are on the right with the color green
        Indexeddb integration: all these texts are saved so that even when we come back to the page, they are saved with the same styling. 
        Interaction: between typing a message out and saving a message makes it a medium. 

Assigned to: Satvi

Profile Feature: 
The profile feature is what is displayed on a user’s feed. A user will be able to see a profile of a different user, which will appear like a card on their feed. This card will include crucial information about a user and will serve as a form of communication and aid engagement on Spotifynder. This design not only provides a snapshot of each user but also facilitates connections and encourages communication. Each profile appears as a visually appealing card that displays the user’s photo, name, and basic information at a glance. The design should be clean and intuitive, making it easy for users to quickly assess potential matches.

Feature Breakdown:

        Profile Feature - The Profile Feature displays user profiles as visually engaging cards within the app's feed, showcasing essential information for fostering connections. Each profile card highlights key details, such as name, shared interests (like favorite artists, playlists tracks), and profile image. This feature emphasizes a streamlined, visually appealing design to encourage users to connect over common music interests.

        Profile Input and Display (Large Feature - 5 points)
        a) Profile Fields: Shows username and email and saves this to IndexedDB. (1 point)
        b) Top Artists, Tracks, and Playlists Display: Dynamically display images of top 3 artists, tracks, and playlists from the onboarding data. (2 points)
        c) Data Storage in IndexedDB: Ensure top artists, tracks, and playlists from the onboarding feature are stored in IndexedDB for data persistence. (2 points)

        Add Button Functionality and Validation (Small Feature - 2 points)
        d) Add Button Functionality: Allows users to add up to three personality prompts, with an error message if they exceed the limit. (1 point)
        e) Error Handling: Validate input fields, ensuring users can only add three prompts, and display an error if the limit is exceeded. (1 point)

        Personality Prompt Edit Form (Medium Feature - 3 points)
        f) Edit Form for Prompts: Allows users to edit previously added personality prompts through a form. Prompts are saved in IndexedDB. (2 points)
        g) Dynamic Update of Display: Automatically update the profile display on the UI after users edit their personality prompts. (1 point)

        IndexedDB Integration (Medium Feature - 2 points)
        h) IndexedDB Object Stores: Set up IndexedDB object stores to save profile information, including personality prompts, artists, tracks, and playlists. (1 point)
        i) Data Retrieval and Display: Retrieve and display stored data from IndexedDB each time the profile is loaded, ensuring data persistence across sessions. (1 point)

        5 + 3 + 2 + 2 = 12

Assigned to: Aanya

















