let db;
const request = window.indexedDB.open('SpotifynderDB', 3);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains('userData')) {
        const objectStore = db.createObjectStore('userData', { keyPath: 'id' });
        objectStore.createIndex('username', 'username', { unique: false });
        objectStore.createIndex('profilePic', 'profilePic', { unique: false });
    }

    if (!db.objectStoreNames.contains('chatsData')) {
        const chatStore = db.createObjectStore('chatsData', { keyPath: 'chatId', autoIncrement: true });
        chatStore.createIndex('isUnread', 'isUnread', { unique: false });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;

    loadUserProfile();
    loadUnreadChatCount();
};

request.onerror = function (event) {
    console.error('Database error:', event.target.errorCode);
};

function loadUserProfile() {
    if (!db) return;

    const transaction = db.transaction(['userData'], 'readonly');
    const objectStore = transaction.objectStore('userData');
    const request = objectStore.get('user');

    request.onsuccess = function (event) {
        const result = event.target.result;
        if (result) {
            if (result.username) {
                document.getElementById('username').textContent = '@' + result.username;
            }
            if (result.profilePic) {
                document.getElementById('profile-pic').src = result.profilePic;
            }
        }
    };

    request.onerror = function (event) {
        console.error('Error loading user data from IndexedDB:', event.target.errorCode);
    };
}

function addDummyData() {
    if (!db) return;

    const userTransaction = db.transaction(['userData'], 'readwrite');
    const userStore = userTransaction.objectStore('userData');
    const dummyUserData = {
        id: 'user',
        username: 'avni',
        profilePic: 'sample-pfp.jpeg'
    };
    userStore.put(dummyUserData);

    const chatTransaction = db.transaction(['chatsData'], 'readwrite');
    const chatStore = chatTransaction.objectStore('chatsData');
    const dummyChats = [
        { isUnread: true, message: "Hello! How are you?" },
        { isUnread: false, message: "Don't forget the meeting tomorrow." },
        { isUnread: true, message: "Can you send me the document?" },
        { isUnread: false, message: "See you soon!" },
        { isUnread: true, message: "Are you coming to the event?" }
    ];
    dummyChats.forEach(chat => {
        chatStore.add(chat);
    });

    userTransaction.oncomplete = function () {
        console.log("Dummy user data added.");
    };
    chatTransaction.oncomplete = function () {
        console.log("Dummy chat data added.");
    };
}

function loadUnreadChatCount() {
    if (!db) return;

    const transaction = db.transaction(['chatsData'], 'readonly');
    const objectStore = transaction.objectStore('chatsData');
    const request = objectStore.getAll();

    let unreadCount = 0;

    request.onsuccess = (event) => {
        const chats = event.target.result;
        chats.forEach(chat => {
            if (chat.isUnread) {
                unreadCount = unreadCount + 1;
            }
        })
        const unreadCountSpan = document.getElementById('unread-count');
        if (unreadCountSpan) {
            unreadCountSpan.innerText = unreadCount;
        }
    }    

    transaction.onerror = function (event) {
        console.error("Error loading unread chat count:", event.target.errorCode);
    };
}

document.querySelectorAll("nav button").forEach(button => {
    button.addEventListener("click", function() {
        // Remove `selected` class from all buttons
        document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("selected"));
        
        // Add `selected` class to the clicked button
        this.classList.add("selected");
    });
});

