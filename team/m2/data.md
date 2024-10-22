## Data Types

### 1. **User Profiles**
- **Description**: Represents individual users who have signed up on Spotifynder. Each profile includes personal and Spotify-related information to enhance matching and discovery features.
- **Attributes**:
  - `user_id`: Unique identifier for each user.
  - `name`: Full name of the user.
  - `email`: User's email address (pulled from Spotify).
  - `profile_picture`: URL of the user’s profile picture.
  - `bio`: Short description written by the user.
  - `college`: User's college affiliation (if provided).
  - `top_artists`: List of top artists (pulled from Spotify API).
  - `top_tracks`: List of top tracks (pulled from Spotify API).
  - `playlists`: List of personal playlists (pulled from Spotify API).
  - `preferences`: User’s preferences for discovering and matching (e.g., filters for college, artists).
  - `timestamp`: Account creation date.

### 2. **Music Data**
- **Description**: Contains music-related data pulled from the Spotify API. This includes users' top artists, tracks, and playlists that help personalize the Spotifynder experience.
- **Attributes**:
  - `artist_id`: Unique identifier for each artist (from Spotify).
  - `artist_name`: Name of the artist.
  - `track_id`: Unique identifier for each track (from Spotify).
  - `track_name`: Name of the track.
  - `playlist_id`: Unique identifier for each playlist (from Spotify).
  - `playlist_name`: Name of the playlist.
  - `timestamp`: When the data was last pulled or updated.

### 3. **Matches**
- **Description**: Represents interactions between users, including both likes and full matches. A match starts as a "like" (pending status) and becomes a full match when both users accept.
- **Attributes**:
  - `match_id`: Unique identifier for each interaction between two users.
  - `user_1_id`: The first user in the interaction.
  - `user_2_id`: The second user in the interaction.
  - `status`: The status of the interaction, which could be:
    - `pending`: One user has liked the other, waiting for a response.
    - `accepted`: Both users have liked each other, resulting in a match.
    - `rejected`: One or both users have rejected the like.
  - `timestamp`: Date and time when the interaction was created or updated.

### 4. **Chats**
- **Description**: Represents conversations between users who have matched.
- **Attributes**:
  - `chat_id`: Unique identifier for each chat.
  - `match_id`: Corresponding match for the chat.
  - `messages`: List of messages exchanged between users.
  - `timestamp`: Date and time of the latest message.

### 5. **Discovery Settings**
- **Description**: Stores a user's discovery preferences, which are used to filter profiles shown on the discovery page.
- **Attributes**:
  - `user_id`: Unique identifier for the user.
  - `filter_by_college`: Boolean indicating if the user wants to filter by college.
  - `filter_by_artists`: Boolean indicating if the user wants to filter by top artists.
  - `filter_by_tracks`: Boolean indicating if the user wants to filter by top tracks.
  - `filter_by_playlists`: Boolean indicating if the user wants to filter by playlists.
  - `timestamp`: Date and time when preferences were last updated.

## Relationships Between Data

- **User Profiles ↔ Music Data**: Each user profile is associated with multiple artists, tracks, and playlists, which are fetched from the Spotify API.
- **User Profiles ↔ Matches**: A user can have multiple match interactions, starting as a "like" with a status of "pending" and potentially progressing to an "accepted" match or a "rejected" interaction.
- **User Profiles ↔ Chats**: When a match reaches the "accepted" status, a chat can be initiated between the two users, tracked in the chats data.
- **User Profiles ↔ Discovery Settings**: Each user can personalize their discovery settings, which influence the profiles they see on the discovery page.

## Data Sources

1. **Spotify API**: A significant portion of the data, such as top artists, top tracks, and playlists, comes directly from users' Spotify accounts. The Spotify API is responsible for fetching this information when users sign in and update their preferences.
   
2. **User-Generated Data**: Users input personal information like their bio, college affiliation, and preferences for the discovery and matching process.
   
3. **System-Generated Data**: Match status, chats, and other interactions are generated based on user actions within the app.