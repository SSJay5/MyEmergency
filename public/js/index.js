/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import axios from 'axios';
import { help } from './help';

const socket = io('https://myemergency.herokuapp.com');

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

const form = document.querySelector('#form');
console.log(form);
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}

var EmergencySearch = document.querySelector('#search-emergencies');
let locations = [72.82119, 18.959125];
if (EmergencySearch) {
  EmergencySearch.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (data) => {
        locations[0] = data.coords.longitude;
        locations[1] = data.coords.latitude;
        displayMap(locations);
        console.log(locations);
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
      }
    );
    let distance = document.getElementById('helping_distance').value;
    distance = distance * 1;
    // console.log('yeh ', distance);

    // emergencies/within/:distance/center/:latlng/unit/:unit
    window.setTimeout(() => {
      location.assign(
        `/emergencies/${distance}/${locations[1]},${locations[0]}/km`
      );
    }, 0);
  });
}
let deleteEmergencyButton = document.getElementsByClassName(
  'emergencies__Card-cancel'
)[0];
if (deleteEmergencyButton) {
  deleteEmergencyButton.addEventListener('click', async (f) => {
    try {
      await axios({
        method: 'DELETE',
        url: '/api/v1/emergencies',
      });
      window.setTimeout(() => {
        location.assign(`/AllEmergencies`);
      }, 0);
    } catch (err) {
      return alert(err.response.data.message);
    }
  });
}

displayMap(locations);
const refreshButton = document.getElementsByClassName('btn-refresh')[0];
if (refreshButton) {
  refreshButton.addEventListener('click', async (f) => {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        locations[0] = data.coords.longitude;
        locations[1] = data.coords.latitude;
        displayMap(locations);
        console.log(locations);
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
      }
    );
  });
  try {
    let res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        currentLocation: locations,
      },
    });
  } catch (err) {
    return alert(err.response.data.message);
  }
}

var emergencyButton = document.getElementsByClassName('btn-emergency')[0];

if (emergencyButton) {
  emergencyButton.addEventListener('click', async (f) => {
    let user;
    try {
      user = await axios({
        method: 'GET',
        url: '/api/v1/users/me',
      });
    } catch (err) {
      return alert(err.response.data.message);
    }
    if (user.emergencyActive) {
      return alert('Your Emergency Alert is already Active ');
    } else {
      try {
        const emergency = await axios({
          method: 'GET',
          url: '/api/v1/emergencies',
        });
        emergencyButton.style.animationName = 'scaleDown';
        emergencyButton.style.animationDuration = '1s';
        emergencyButton.remove();
      } catch (err) {
        return alert(err.response.data.message);
      }
    }
  });
}
var helpButton = document.getElementsByClassName('btn-help')[0];
let helpingLocation = [];
if (helpButton) {
  helpButton.addEventListener('click', async (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (data) => {
        locations[0] = data.coords.longitude;
        locations[1] = data.coords.latitude;
      },
      (error) => {
        return console.log(error);
      },
      {
        enableHighAccuracy: true,
      }
    );
    const emergencyId = JSON.parse(
      document.getElementById('map').dataset.emergencyid
    );
    try {
      let res = await axios({
        method: 'GET',
        url: `/api/v1/emergencies/${emergencyId}`,
      });
      helpingLocation = res.data.data.location;
      console.log(res.data);
    } catch (err) {
      return alert(err.response.data.message);
    }

    try {
      let res = await axios({
        method: 'PATCH',
        url: '/api/v1/users/updateMe',
        data: {
          currentLocation: locations,
        },
      });
    } catch (err) {
      return alert(err.response.data.message);
    }

    console.log(helpingLocation);
    console.log(locations);
    help(helpingLocation, locations);
  });
}
