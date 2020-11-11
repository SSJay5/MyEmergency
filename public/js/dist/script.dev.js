"use strict";

/*eslint-disable*/
var socket = io('/');
var messageForm = document.getElementById('send-container');
var messageContainer = document.getElementById('message-container');
var messageInput = document.getElementById('message-input');

function appendMessage(message) {
  var messageElement = document.createElement('div');
  messageElement.className = 'emergencyChatBox__message';
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

if (messageForm != null) {
  var name = JSON.parse(document.getElementById('message-container').dataset.username);
  var roomName = JSON.parse(document.getElementById('map').dataset.emergencyid);
  appendMessage('You Joined');
  socket.emit('new-user', roomName, name);
  messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var message = messageInput.value;
    appendMessage("You: ".concat(message));
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
  });
}

socket.on('chat-message', function (data) {
  appendMessage("".concat(data.name, ": ").concat(data.message));
});
socket.on('user-connected', function (name) {
  appendMessage("".concat(name, " connected"));
});
socket.on('user-disconnected', function (name) {
  appendMessage("".concat(name, " disconnected"));
});