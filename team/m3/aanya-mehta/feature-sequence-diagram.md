```mermaid
sequenceDiagram
    participant User as User
    participant ProfilePage as Profile Page
    participant IndexedDB as IndexedDB

    User ->> ProfilePage: View Profile Page
    ProfilePage ->> UserInfo: Display User Information (Profile Picture, Username, Email)
    ProfilePage ->> ArtistsDisplay: Display Top 3 Artists
    ProfilePage ->> TracksDisplay: Display Top 3 Tracks
    ProfilePage ->> PlaylistsDisplay: Display Top 3 Playlists
    ProfilePage ->> PersonalityPrompts: Display Personality Prompts

    User ->> PersonalityPrompts: Add Personality Prompt
    PersonalityPrompts ->> IndexedDB: Check prompt limit
    IndexedDB -->> PersonalityPrompts: Returns prompt count
    PersonalityPrompts ->> User: Show error if prompt limit exceeded
    PersonalityPrompts ->> IndexedDB: Automatically store prompt if limit not exceeded

    User ->> PersonalityPrompts: Edit Personality Prompt
    PersonalityPrompts ->> IndexedDB: Automatically update prompt in database
    IndexedDB -->> PersonalityPrompts: Confirm update

    User ->> ProfilePage: Refresh Profile Page
    ProfilePage ->> IndexedDB: Retrieve and display updated data
```