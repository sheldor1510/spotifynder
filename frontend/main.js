document.getElementById("onboarding1").style.display = "none";
document.getElementById("onboarding2").style.display = "block";
document.getElementById("discovery").style.display = "none";
document.getElementById("discovery-content-wrapper").style.display = "block";
document.getElementById("chat-content-wrapper").style.display = "none";
document.getElementById("profile-content-wrapper").style.display = "none";

document.getElementById("discovery-btn").addEventListener("click", function() {
    document.getElementById("discovery-content-wrapper").style.display = "block";
    document.getElementById("chat-content-wrapper").style.display = "none";`    `
    document.getElementById("profile-content-wrapper").style.display = "none";
});

document.getElementById("chats-btn").addEventListener("click", function() {
    document.getElementById("discovery-content-wrapper").style.display = "none";
    document.getElementById("chat-content-wrapper").style.display = "flex";
    document.getElementById("profile-content-wrapper").style.display = "none";
});

document.getElementById("profile-btn").addEventListener("click", function() {
    document.getElementById("discovery-content-wrapper").style.display = "none";
    document.getElementById("chat-content-wrapper").style.display = "none";
    document.getElementById("profile-content-wrapper").style.display = "block";    
});