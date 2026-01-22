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

createBtn.addEventListener('click', function(event) {
    event.preventDefault();


    const groupName = document.getElementById('groupName').value;
    const groupCategory = document.getElementById('groupCategory').value;
    const groupDescription = document.getElementById('groupDescription').value;
    
 
    if (groupName && groupCategory) {
   
        const newCard = document.createElement('article');
        newCard.className = 'group-card';
        
        newCard.innerHTML = `
            <h2>${groupName}</h2>
            <p class="expertise">Area: ${groupCategory.charAt(0).toUpperCase() + groupCategory.slice(1)}</p>
            <p class="description">${groupDescription || 'No description provided'}</p>
            <h3>Related Topics:</h3>
            <ul class="topics">
                <li>New Group</li>
            </ul>
            <p class="member-number">1 members</p>
            <button class="join-btn">Join</button>
        `;
        
        //Add new card
        const groupList = document.querySelector('.group-list');
        groupList.appendChild(newCard);
        
        const newJoinBtn = newCard.querySelector('.join-btn');
        newJoinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (newJoinBtn.textContent === 'Join') {
                newJoinBtn.textContent = 'Joined';
                newJoinBtn.classList.add('joined');
            } else {
                newJoinBtn.textContent = 'Join';
                newJoinBtn.classList.remove('joined');
            }
        });
        
        closeModal();
    }
});

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