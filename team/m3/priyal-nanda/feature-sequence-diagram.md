```Mermaid
sequenceDiagram
    participant User
    participant UI
    participant IndexedDB

    User->>UI: Select artist from the list
    UI->>UI: Highlight selected artist
    UI->>IndexedDB: Store selected artist
    User->>UI: Select another artist from the list
    UI->>UI: Highlight selected artist
    UI->>IndexedDB: Store selected artist
    User->>UI: Select third artist from the list
    UI->>UI: Highlight selected artist
    UI->>IndexedDB: Store selected artist

    User->>UI: Select track from the list
    UI->>UI: Highlight selected track
    UI->>IndexedDB: Store selected track
    User->>UI: Select another track from the list
    UI->>UI: Highlight selected track
    UI->>IndexedDB: Store selected track
    User->>UI: Select third track from the list
    UI->>UI: Highlight selected track
    UI->>IndexedDB: Store selected track

    UI->>User: Display confirmation message ("Selections saved!")
```