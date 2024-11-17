# Feature Sequence Diagram: User Profile Card Component (Front and Back Views)

## Feature Description
The User Profile Card Component provides detailed user information through two interactive views:
1. **Front View**:
   - Displays the user's profile picture, username, compatibility score, and top 3 artists, tracks, and playlists.
   - Data is fetched dynamically from IndexedDB and reflects any updates from filter changes or interactions.
2. **Back View**:
   - Displays personality prompts with Q&A cards.
   - Dynamically updates to show data persisted in IndexedDB.

### Key Components:
1. **IndexedDB**:
   - Stores user profile data (profile picture, username, compatibility score, top 3 artists, tracks, playlists, and personality Q&A).
   - Updates dynamically based on user interactions.
2. **JavaScript Logic**:
   - Retrieves and updates data from IndexedDB.
   - Toggles between front and back views of the profile card.
3. **User Interface (UI)**:
   - Displays dynamically fetched and updated profile details and Q&A cards.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as User Interface
    participant JS as JavaScript Logic
    participant IDB as IndexedDB

    User->>UI: Opens the User Profile Card
    UI->>JS: Request data for profile details and top items
    JS->>IDB: Fetch profile data (username, picture, compatibility score)
    IDB-->>JS: Return profile details
    JS->>IDB: Fetch top 3 artists, tracks, and playlists
    IDB-->>JS: Return top items data
    JS->>UI: Populate the Front View with retrieved data

    User->>UI: Clicks "View More" to toggle to Back View
    UI->>JS: Trigger event to switch to Back View
    JS->>IDB: Fetch Q&A personality prompts
    IDB-->>JS: Return Q&A data
    JS->>UI: Populate the Back View with retrieved data

    User->>UI: Interacts with Q&A cards (e.g., answers a question)
    UI->>JS: Trigger event listener for user action
    JS->>IDB: Update Q&A responses in IndexedDB
    JS->>UI: Reflect updates dynamically in the Back View
```