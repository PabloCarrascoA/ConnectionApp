const modal = document.getElementById('createGroupModal');
const createGroupBtn = document.getElementById('createGroupBtn');
const closeBtn = document.getElementById('closeBtn');
const cancelBtn = document.getElementById('cancelBtn');
const createBtn = document.querySelector('.btn-create');
const form = document.getElementById('createGroupForm');

createGroupBtn.addEventListener('click', function() {
    modal.style.display = 'block';
});

function closeModal() {
    modal.style.display = 'none';
    form.reset();
}

closeBtn.addEventListener('click', closeModal);

cancelBtn.addEventListener('click', closeModal);

createBtn.addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

//boton join
const joinBtns = document.querySelectorAll('.join-btn');

joinBtns.forEach(btn => {
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (btn.textContent === 'Join') {
            btn.textContent = 'Joined';
            btn.classList.add('joined');
        } else {
            btn.textContent = 'Join';
            btn.classList.remove('joined');
        }
    });
});