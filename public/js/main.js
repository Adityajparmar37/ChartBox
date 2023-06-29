const chartForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
// const roomNameSidebar = document.querySelector('#room-sidebar');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// const userListSidebar = document.querySelector('#user-list-sidebar');

// const email = document.querySelector('.admin-user');

const hand = document.getElementById('hand-gif');
const send = document.getElementById('send2')


//Get username and room from url

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();

//if not admin
socket.on('redirect',url=>{
    alert(' YOU ARE NOT A ADMIN !');
    window.location.href=url;
});

//Join chatroom
socket.emit('joinRoom', { username, room})


//Get Room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down 
    chatMessage.scrollTop = chatMessage.scrollHeight;
});


//new user message
socket.on('message-new', message => {
    console.log(message);
    outputMessageNew(message);

    //scroll down 
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//user left message
socket.on('messageLeft', message => {
    console.log(message);
    outputMessageLeft(message);

    //scroll down 
    chatMessage.scrollTop = chatMessage.scrollHeight;
});




//client message submit

chartForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;



    //sending message from clinet side to server side
    socket.emit('chatMessage', msg);


    //cleaing the input box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


send.addEventListener("click", () => {
    hand.style.display = 'none';
})




function outputMessageNew(message) {
    const div = document.createElement('div');
    div.classList.add('messageNew');
    div.innerHTML = `<p class="meta">${message.text} <span> at ${message.time}</span></p>
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Output message to DOM

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text"> ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
    // roomNameSidebar.innerText = room;
}





//Add user to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;

    // userListSidebar.innerHTML = `
    // ${users.map(user => `<li>${user.username}</li>`).join('')}
    // `;
}

//left user message
function outputMessageLeft(message) {
    const div = document.createElement('div');
    div.classList.add('messageNew');
    div.innerHTML = `<p class="meta">${message.text} <span> at ${message.time}</span></p>
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}




