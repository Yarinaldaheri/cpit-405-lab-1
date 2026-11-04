const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const likeCountEl = document.getElementById("like-count");
const dislikeCountEl = document.getElementById("dislike-count");
const commentInput = document.getElementById("comment-input");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const commentsList = document.getElementById("comments-list");
const message = document.getElementById("message");

let likes = 0;
let dislikes = 0;
let comments = [];


function setCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; max-age=" + 7 * 24 * 60 * 60 + "; path=/";
}

function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const parts = cookie.trim().split("=");
        if (parts[0] === name) {
            return decodeURIComponent(parts[1]);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=" + new Date(2000, 0, 1).toUTCString() + "; path=/";
}

function updateUI() {
    likeCountEl.textContent = likes;
    dislikeCountEl.textContent = dislikes;

    const vote = getCookie("vote");
    likeBtn.disabled = vote !== null;
    dislikeBtn.disabled = vote !== null;

    commentsList.innerHTML = "";
    comments.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        commentsList.appendChild(li);
    });

    const hasCommented = getCookie("comments") !== null;
    submitBtn.disabled = hasCommented;
    commentInput.disabled = hasCommented;
}

function vote(choice) {
    if (getCookie("vote") !== null) {
        return; 
    }
    if (choice === "like") {
        likes++;
    } else {
        dislikes++;
    }
    setCookie("vote", choice);
    updateUI();
}

likeBtn.addEventListener("click", function () {
    vote("like");
});

dislikeBtn.addEventListener("click", function () {
    vote("dislike");
});


submitBtn.addEventListener("click", function () {
    const text = commentInput.value.trim();
    if (text === "" || getCookie("comments") !== null) {
        return;
    }
    comments.push(text);
    setCookie("comments", JSON.stringify(comments));
    commentInput.value = "";
    updateUI();
});

resetBtn.addEventListener("click", function () {
    deleteCookie("vote");
    deleteCookie("comments");
    likes = 0;
    dislikes = 0;
    comments = [];
    commentInput.value = "";
    updateUI();

    message.textContent = "Your vote and comment have been cleared ✔";
    setTimeout(function () {
        message.textContent = "";
    }, 3000);
});

function loadState() {
    const vote = getCookie("vote");
    if (vote === "like") {
        likes++;
    } else if (vote === "dislike") {
        dislikes++;
    }

    const savedComments = getCookie("comments");
    if (savedComments !== null) {
        comments = JSON.parse(savedComments);
    }

    updateUI();
}

loadState();