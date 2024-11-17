sequenceDiagram
    participant User
    participant UI
    participant IndexedDB

    User->>UI: Type details for Playlist 1 (name/description)

    UI->>IndexedDB: Store playlist details (Playlist 1)

    User->>UI: Type details for Playlist 2 (name/description)

    UI->>IndexedDB: Store playlist details (Playlist 2)

    User->>UI: Type details for Playlist 3 (name/description)

    UI->>IndexedDB: Store playlist details (Playlist 3)
   
    User->>UI: Click "Continue"

    UI->>UI: Transition to Questionnaire Form
 
