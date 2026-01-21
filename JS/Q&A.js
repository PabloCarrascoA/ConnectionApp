

const STORAGE_KEY = 'connection_app_qas_v1';

let qas = loadQAs();

// Elements
const form = document.getElementById('qa-form');
const questionInput = document.getElementById('question');
const categorySelect = document.getElementById('category');
const answerInput = document.getElementById('answer');
const searchInput = document.getElementById('myInput');
const container = document.getElementById('qa-container');

// Initial render
render();

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  const category = categorySelect.value;
  if (!question) return; // simple validation

  const entry = {
    id: Date.now(),
    question,
    category,
    replies: [],
    createdAt: new Date().toISOString(),
  };

  qas.unshift(entry); // newest first
  saveQAs();
  form.reset();
  render();
});

searchInput.addEventListener('input', () => render());

// Helpers
function loadQAs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // sample data
      return [
        { id: 1, question: 'How much time should I expect to spend studying each week in a Computer Science program? Im worried about balancing coursework with part-time work.', category: 'Computer Science', replies: [{ id: 101, text: 'O(log n)', createdAt: new Date().toISOString() }] },
        { id: 2, question: 'Is it possible to switch between business specializations (like from Finance to Marketing) once you ve started your degree?', category: 'Business', replies: [{ id: 102, text: 'A financial statement showing assets, liabilities, and equity.', createdAt: new Date().toISOString() }] },
        { id: 3, question: 'What is photosynthesis?', category: 'Science', replies: [{ id: 103, text: 'The process by which plants convert light energy into chemical energy.', createdAt: new Date().toISOString() }] },
      ];
    }
    const parsed = JSON.parse(raw);
    // normalize old shape: some items may have `answer` string instead of `replies` array
    return parsed.map((item) => {
      if (Array.isArray(item.replies)) return item;
      if (typeof item.answer === 'string' && item.answer.trim() !== '') {
        return { ...item, replies: [{ id: Date.now() + Math.floor(Math.random() * 1000), text: item.answer, createdAt: new Date().toISOString() }] };
      }
      return { ...item, replies: [] };
    });
  } catch (err) {
    console.error('Failed to load QAs', err);
    return [];
  }
}

function saveQAs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qas));
  } catch (err) {
    console.error('Failed to save QAs', err);
  }
}

function render() {
  const filter = searchInput.value.trim().toLowerCase();
  // Group by category
  const groups = qas.reduce((acc, item) => {
    const repliesText = (item.replies || []).map(r => r.text).join(' ');
    if (filter) {
      const hay = (item.question + ' ' + repliesText + ' ' + item.category).toLowerCase();
      if (!hay.includes(filter)) return acc; // skip non-matching
    }
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Clear container
  container.innerHTML = '';

  const categories = Object.keys(groups);
  if (categories.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No questions found.';
    container.appendChild(p);
    return;
  }

  categories.forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'category-section';

    const header = document.createElement('h3');
    header.textContent = cat + ` (${groups[cat].length})`;
    section.appendChild(header);

    const ul = document.createElement('ul');
    ul.className = 'qa-list';

    groups[cat].forEach((item) => {
      const li = document.createElement('li');
      li.className = 'qa-item';

      const qEl = document.createElement('div');
      qEl.className = 'question';
      qEl.textContent = 'Q: ' + item.question;

      // Replies container
      const repliesContainer = document.createElement('div');
      repliesContainer.className = 'replies-container';
      if ((item.replies || []).length === 0) {
        const none = document.createElement('div');
        none.className = 'no-replies';
        none.textContent = 'No replies yet.';
        repliesContainer.appendChild(none);
      } else {
        item.replies.forEach((r) => {
          const rDiv = document.createElement('div');
          rDiv.className = 'reply';
          rDiv.textContent = r.text;

          const delR = document.createElement('button');
          delR.className = 'delete-reply-btn';
          delR.textContent = 'X';
          delR.addEventListener('click', () => {
            item.replies = item.replies.filter(rr => rr.id !== r.id);
            saveQAs();
            render();
          });

          rDiv.appendChild(delR);
          repliesContainer.appendChild(rDiv);
        });
      }

      const aEl = repliesContainer;

      // delete button
      const btn = document.createElement('button');
      btn.className = 'delete-btn';
      btn.textContent = 'Delete';
      btn.addEventListener('click', () => {
        qas = qas.filter((q) => q.id !== item.id);
        saveQAs();
        render();
      });

      // reply button + form (hidden by default)
      const replyBtn = document.createElement('button');
      replyBtn.className = 'reply-btn';
      replyBtn.textContent = 'Reply';

      const replyForm = document.createElement('form');
      replyForm.className = 'reply-form';
      replyForm.style.display = 'none';

      const replyInput = document.createElement('textarea');
      replyInput.rows = 2;
      replyInput.placeholder = 'Write your reply...';
      replyInput.required = true;

      const replySubmit = document.createElement('button');
      replySubmit.type = 'submit';
      replySubmit.textContent = 'Post reply';

      replyForm.appendChild(replyInput);
      replyForm.appendChild(replySubmit);

      replyBtn.addEventListener('click', () => {
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
      });

      replyForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const text = replyInput.value.trim();
        if (!text) return;
        const newReply = { id: Date.now() + Math.floor(Math.random() * 1000), text, createdAt: new Date().toISOString() };
        item.replies = item.replies || [];
        item.replies.unshift(newReply);
        saveQAs();
        render();
      });

      li.appendChild(qEl);
      li.appendChild(aEl);
      li.appendChild(replyBtn);
      li.appendChild(replyForm);
      li.appendChild(btn);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    container.appendChild(section);
  });
}