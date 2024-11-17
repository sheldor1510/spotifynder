sequenceDiagram
    participant User
    participant UI
    participant IndexedDB

    User->>UI: Type details for Playlist 1 (e.g., name, description)
    User->>UI: Type details for Playlist 2 (e.g., name, description)
    User->>UI: Type details for Playlist 3 (e.g., name, description)
    User->>UI: Type response for Personality Prompt 1
    User->>UI: Type response for Personality Prompt 2
    User->>UI: Type response for Personality Prompt 3
    User->>UI: Click "Submit"
    
    UI->>IndexedDB: Store playlist details (Playlist 1, Playlist 2, Playlist 3)
    UI->>IndexedDB: Store personality responses (Prompt 1, Prompt 2, Prompt 3)
    
    UI->>UI: Transition to Questionnaire Form
    UI->>User: Display Questionnaire Form