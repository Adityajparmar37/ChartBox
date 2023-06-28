const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./public/utils/user');



const app = express();

const server = http.createServer(app);
const io = socketio(server);


//SET static folder

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChartBox';
//runs when client connect

io.on('connection', socket => {
    console.log('New WS Connection...');

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);



        //Welcome new user (new client)
        socket.emit('message', formatMessage(botName, 'Welcome to ChartBox!'));

        //broadcast on connecting with connect

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, ` ${user.username} has joined the chart`));


        //side bar user and room info

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });



    //get message from slient side
    socket.on('chatMessage', msg => {
        // console.log(msg);

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg))


    });

    //Client Disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {

            io.to(user.room).emit('message', formatMessage(botName, ` ${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
})