// 1) Sample data
const samplePosts = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "3rd Year Student • Computer Science",
        time: "2 hours ago",
        content: "Just finished my first semester of Data Structures...",
        likes: 45,
        comments: 12,
        shares: 6,
        liked: false,
        commentsList: []
    },
    {
        id: 2,
        name: "Marcus Johnson",
        role: "2nd Year Student • Information Systems",
        time: "5 hours ago",
        content: "Anyone joining the studygroup for Algorithms this Friday?",
        likes: 18,
        comments: 4,
        shares: 1,
        liked: false,
        commentsList: []
    }
];

let posts = [];

// localStorage functions
function savePosts() {
    localStorage.setItem('connectionPosts', JSON.stringify(posts));
}

function loadPosts() {
    const saved = localStorage.getItem('connectionPosts');
    if (saved) {
        posts = JSON.parse(saved);
        // Ensure all posts have commentsList (for compatibility with old saved data)
        posts.forEach(post => {
            if (!post.commentsList) {
                post.commentsList = [];
            }
        });
    } else {
        posts = JSON.parse(JSON.stringify(samplePosts)); // Deep copy sample posts
        savePosts();
    }
}

// 2) DOM elements

const feedEl = document.getElementById('feed');
const postInput = document.getElementById('post-input');
const postBtn = document.getElementById('post-btn');

// 3) Render helper function

function renderComments(post, commentsListEl) {
    commentsListEl.innerHTML = "";
    post.commentsList.forEach(comment => {
        const commentEl = document.createElement("div");
        commentEl.className = "comment-item";
        commentEl.innerHTML = `
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
        `;
        commentsListEl.appendChild(commentEl);
    });
}

function renderPost(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
    <div class="post-header">
        <div class="user-avatar">${getInitials(post.name)}</div>
        <div class="user-info">
            <h3>${post.name}</h3>
            <div class="user-details">${post.role}</div>
            <div class="post-time">${post.time}</div>
        </div>
    </div>

    <div class="post-content">${escapeHtml(post.content)}</div>
    <div class="post-actions">
      <button class="action-btn like-btn ${post.liked ? 'liked' : ''}"><i data-lucide="heart"></i> <span>${post.likes}</span></button>
      <button class="action-btn comment-btn"><i data-lucide="message-circle"></i> <span>${post.comments}</span></button>
      <button class="action-btn share-btn"><i data-lucide="share-2"></i> <span>${post.shares}</span></button>
    </div>

    <div class="post-comments" style="display: none;">
      <div class="comments-list"></div>
      <div class="comment-input-section">
        <input type="text" class="comment-input" placeholder="Add a comment...">
        <button class="comment-post-btn">Post</button>
      </div>
    </div>
    `;
    attachActionHandlers(card, post);
    
    // Render initial comments
    const commentsListEl = card.querySelector(".comments-list");
    renderComments(post, commentsListEl);
    
    feedEl.prepend(card);
    lucide.createIcons(); // Initialize Lucide icons for new post
}

// 4) Render initial posts
function renderFeed() {
    feedEl.innerHTML = "";
    // Loop in reverse so newest stays on top
    for (let i = posts.length - 1; i >= 0; i--) {
        renderPost(posts[i]);
    }
}

// 5) Post creation
postBtn.addEventListener('click', () => {
    const text = postInput.value.trim();
    if (!text) return;
    const newPost = {
        id: Date.now(),
        name: "You",
        role: "Community Member",
        time: "Just now",
        content: text,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        commentsList: []
    };
    posts.unshift(newPost);
    savePosts(); // Save to localStorage
    renderFeed();
    postInput.value = "";
});

// 6) Action handlers (like toggle; comment/share placeholders)
function attachActionHandlers(card, post) {
  const likeBtn = card.querySelector(".like-btn");
  const commentBtn = card.querySelector(".comment-btn");
  const shareBtn = card.querySelector(".share-btn");

  likeBtn.addEventListener("click", () => {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    likeBtn.innerHTML = `<i data-lucide="heart"></i> <span>${post.likes}</span>`;
    savePosts(); // Save to localStorage when like changes
    likeBtn.classList.toggle("liked", post.liked);
    lucide.createIcons(); // Reinitialize icons after DOM change
  });

  commentBtn.addEventListener("click", () => {
    const commentsSection = card.querySelector(".post-comments");
    commentsSection.style.display = commentsSection.style.display === "none" ? "block" : "none";
  });

  const commentPostBtn = card.querySelector(".comment-post-btn");
  const commentInput = card.querySelector(".comment-input");
  const commentsListEl = card.querySelector(".comments-list");

  commentPostBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    post.commentsList.push({
        author: "You",
        text: commentText
    });
    post.comments += 1;
    
    renderComments(post, commentsListEl);
    commentInput.value = "";
    savePosts();
  });

  shareBtn.addEventListener("click", () => {
    alert("Share coming soon!");
  });

  shareBtn.addEventListener("click", () => {
    alert("Share coming soon!");
  });
}

// 7) Utilities
function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

loadPosts(); // Load posts from localStorage
// 8) Kick off
renderFeed();