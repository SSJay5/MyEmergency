/*eslint-disable*/
const socket = io('https://enigmatic-coast-74172.herokuapp.com');
const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'emergencyChatBox__message';
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
if (messageForm != null) {
  const name = JSON.parse(
    document.getElementById('message-container').dataset.username
  );
  const roomName = JSON.parse(
    document.getElementById('map').dataset.emergencyid
  );
  appendMessage('You Joined');

  socket.emit('new-user', roomName, name);

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
  });
}

socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', (name) => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`);
});
