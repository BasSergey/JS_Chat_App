//const e = require("cors");

var socket = io.connect('http://localhost:8080');
var user = '';

window.onload = function () {

    var users_container = document.getElementById('userlist');
    var message_container = document.getElementById('messages');
    var my_users = document.getElementById('my-user');

    message_container.style.height = window.innerHeight - 200 + 'px';

    var btn = document.getElementById('btn');
    var message_input = document.getElementById('inp');

    a = 0;

    // загрузить имена пользователей, которые online 
    socket.emit('load users');
    socket.on('users loaded', function (data) {
        // var display_users = data.users.map((username) => {
        //     console.log(username);
        //     return `<li>${username}</li>`;
        // });
        var display_users = "";


        for (let i = 0; i < data.users.length - 1; i++) {
            display_users += `<li>${data.users[i]}</li>`;
        }

        display_users += `<li id="last_username">${data.users[data.users.length - 1]}</li>`

        users_container.innerHTML = display_users;
    });

    // загрузить сообщения других пользователей (при загрузке страницы)
    socket.emit('load messages');
    socket.on('messages loaded', function (data) {

        var display_messages = data.messages.map((msg) => {

            return (`<div class ="panel well">
                         <h4>${msg.author}</h4>
                         <h5>${msg.text}</h5>
                    </div>`)
        });

        message_container.innerHTML = display_messages.join(' ');

    });

    // загрузить текущее сообщение
    socket.on('chat message', function (message) {
        console.log(message)
        var display_message;
        if (message.author == user) {
            display_message = `<div class ="panel well right">
            <h4>Me:</h4>
            <h5>${message.text}</h5>
        </div>`
        }
        else {
            display_message = `<div class ="panel well" id="${a}" >
            <h4>${message.author}</h4>
            <h5>${message.text}</h5>
        </div>`
            a += 1;
        }

        display_message += message_container.innerHTML;
        message_container.innerHTML = display_message;

        //!сделать мигающее сообщение от кого то
        if (message.author != user) {
            for (let i = 0; i < 5; i++) {
                console.log("#" + (a - 1));
                $("#" + (a - 1)).fadeOut(100).fadeIn(500);
            }
        }
    });

    // получить имя пользователя 
    socket.on('new user', function (data) {
        user = data.name;
        my_users.innerHTML = "<p>" + user + "</p>";
    })


    document.querySelector('input').addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {

            socket.emit('send message', { text: message_input.value, author: user });
            message_input.value = "";
            //message_input.innerHTML = "";
        }
    });

    btn.onclick = function () {
        // сгенерировать событие отправки сообщения 

        socket.emit('send message', { text: message_input.value, author: user });
        message_input.value = "";

    }

}
