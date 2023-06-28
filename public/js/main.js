const chartForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//Get username and room from url

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();

//Join chatroom
socket.emit('joinRoom', { username, room })


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
}



//Add user to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

