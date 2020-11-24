/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './logout';
import { signup } from './signUp';
import axios from 'axios';
import { help } from './help';

const socket = io('https://myemergency.herokuapp.com');

const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');

let roomName;
let name;
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'emergencyChatBox__message';
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
if (messageForm != null) {
  name = JSON.parse(
    document.getElementById('message-container').dataset.username
  );
  roomName = JSON.parse(
    document.getElementById('map').getAttribute('data-emergencyid')
  );
  // console.log(name);
  appendMessage('You Joined');

  socket.emit('new-user', roomName, name);

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    roomName = JSON.parse(
      document.getElementById('map').getAttribute('data-emergencyid')
    );
    console.log(roomName);
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
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log(email, password);
    login(email, password);
  });
}
const logoutButton = document.getElementsByClassName('logout');
if (logoutButton[0]) {
  logoutButton[0].addEventListener('click', (e) => {
    logout();
  });
}
if (logoutButton[1]) {
  logoutButton[1].addEventListener('click', (e) => {
    logout();
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
        // displayMap(currLocation);
        // console.log(currLocation);
      },
      (error) => {
        console.log(error);
        return alert('Please Turn On Your GPS !!!');
      },
      {
        enableHighAccuracy: true,
      }
    );
    if (locations[0] == null || locations[1] == null) {
      return alert('Please Provide Your Location');
    }
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
var emergencyButton = document.getElementsByClassName('btn-emergency')[0];

if (emergencyButton) {
  emergencyButton.addEventListener('click', async (f) => {
    let user;
    navigator.geolocation.getCurrentPosition(
      (data) => {
        locations[0] = data.coords.longitude;
        locations[1] = data.coords.latitude;
        // displayMap(currLocation);
        // console.log(currLocation);
      },
      (error) => {
        console.log(error);
        return alert('Please Turn On Your GPS !!!');
      },
      {
        enableHighAccuracy: true,
      }
    );
    if (locations[0] == null || locations[1] == null) {
      return alert('Please Provide Your Location');
    }
    displayMap(locations);
    try {
      let res = await axios({
        method: 'PATCH',
        url: '/api/v1/users/updateMe',
        data: {
          currentLocation: locations,
        },
      });
      user = await axios({
        method: 'GET',
        url: '/api/v1/users/me',
      });
      if (user.emergencyActive) {
        return alert('Your Emergency Alert is already Active ');
      } else {
        const emergency = await axios({
          method: 'GET',
          url: '/api/v1/emergencies',
        });
        emergencyButton.style.animationName = 'scaleDown';
        emergencyButton.style.animationDuration = '1s';
        let Map = document.getElementById('map');
        Map.setAttribute(
          'data-emergencyid',
          JSON.stringify(emergency.data.data.data._id)
        );
        // console.log(Map);
        emergencyButton.remove();
      }
      name = JSON.parse(
        document.getElementById('message-container').dataset.username
      );
      roomName = JSON.parse(
        document.getElementById('map').getAttribute('data-emergencyid')
      );
      socket.emit('new-user', roomName, name);
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
        // displayMap(currLocation);
        // console.log(currLocation);
      },
      (error) => {
        console.log(error);
        return alert('Please Turn On Your GPS !!!');
      },
      {
        enableHighAccuracy: true,
      }
    );
    if (locations[0] == null || locations[1] == null) {
      return alert('Please Provide Your Location');
    }
    displayMap(locations);
    try {
      let res = await axios({
        method: 'PATCH',
        url: '/api/v1/users/updateMe',
        data: {
          currentLocation: locations,
        },
      });
    } catch (err) {
      return alert('Please Login To Continue');
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
        // displayMap(currLocation);
        // console.log(currLocation);
      },
      (error) => {
        console.log(error);
        return alert('Please Turn On Your GPS !!!');
      },
      {
        enableHighAccuracy: true,
      }
    );
    // console.log(getMyCurrnetLocation());
    if (locations[0] == null || locations[1] == null) {
      return alert('Please Provide Your Location');
    }
    const emergencyId = JSON.parse(
      document.getElementById('map').dataset.emergencyid
    );
    try {
      let res = await axios({
        method: 'GET',
        url: `/api/v1/emergencies/${emergencyId}`,
      });
      helpingLocation = res.data.data.location;
      // console.log(res.data);
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

    // console.log(helpingLocation);
    // console.log(locations);
    help(helpingLocation, locations);
  });
}
