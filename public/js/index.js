/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './logout';
import { signup } from './signUp';
import axios from 'axios';
import { help } from './help';
import { avenger } from './avengers';
import { resetPassword } from './resetPassword';
import { forgotPassword } from './forgotPassword';
import { updateUserData } from './updateUserData';
import { updateUserPassword } from './updateUserPassword';
import { spinner } from './sipnner';

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
function isGoodNumber(n) {
  for (let i = 0; i < n.length; i += 1) {
    if (n[i] < '0' || n[i] > '9') {
      return false;
    }
  }
  return true;
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
    // console.log(roomName);
    if (messageInput.value.length === 0) {
      return;
    }
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
const signUpForm = document.getElementById('signup');
if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    if (name.includes(':')) {
      return alert('Enter Username without : in it');
    }
    if (password.length < 8) {
      return alert('Please Enter Password of Length greater than 7');
    }
    if (password !== passwordConfirm) {
      return alert('Entered Passwords Do not match');
    }
    signup(name, email, password, passwordConfirm);
  });
}
var EmergencySearch = document.querySelector('#search-emergencies');
let locations = [72.877656, 19.075984];
if (EmergencySearch) {
  EmergencySearch.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (data) => {
        locations[0] = data.coords.longitude;
        locations[1] = data.coords.latitude;
        // displayMap(currLocation);
        // console.log(currLocation);
        if (locations[0] == null || locations[1] == null) {
          return alert('Please Provide Your Location');
        }
        let distance = document.getElementById('helping_distance').value;
        if (!isGoodNumber(distance)) {
          return alert('Please Enter A Valid Number');
        }
        distance = distance * 1;
        // console.log('yeh ', distance);
        // emergencies/within/:distance/center/:latlng/unit/:unit
        window.setTimeout(() => {
          location.assign(
            `/emergencies/${distance}/${locations[1]},${locations[0]}/km`
          );
        }, 0);
      },
      (error) => {
        // console.log(error);
        return alert('Please Turn On Your GPS !!!');
      },
      {
        enableHighAccuracy: true,
      }
    );
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
    try {
      spinner('add');
      let user;
      navigator.geolocation.getCurrentPosition(
        async (data) => {
          locations[0] = data.coords.longitude;
          locations[1] = data.coords.latitude;
          // displayMap(currLocation);
          // console.log(currLocation);
          if (locations[0] == null || locations[1] == null) {
            spinner('del');
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
              spinner('del');
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
            spinner('del');
            socket.emit('new-user', roomName, name);
            document.getElementById('blurLayer').remove();
          } catch (err) {
            spinner('del');
            return alert(err.response.data.message);
          }
        },
        (error) => {
          // console.log(error);
          spinner('del');
          return alert('Please Turn On Your GPS !!!');
        },
        {
          enableHighAccuracy: true,
        }
      );
    } catch (err) {
      spinner('del');
      return alert(err.response.data.message);
    }
  });
}
if (document.getElementById('map')) displayMap(locations);

const refreshButton = document.getElementsByClassName('btn-refresh')[0];
if (refreshButton) {
  refreshButton.addEventListener('click', async (f) => {
    try {
      let Location = [];
      navigator.geolocation.getCurrentPosition(
        async (data) => {
          Location[0] = data.coords.longitude;
          Location[1] = data.coords.latitude;
          // displayMap(currLocation);
          // console.log(currLocation);
          console.log(Location);
          if (Location[0] === null || Location[1] === null) {
            return alert('Please Provide Your Location');
          }
          displayMap(Location);
          let res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data: {
              currentLocation: Location,
            },
          });
        },
        (error) => {
          // console.log(error);
          return alert('Please Turn On Your GPS !!!');
        },
        {
          enableHighAccuracy: true,
        }
      );
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
    try {
      navigator.geolocation.getCurrentPosition(
        async (data) => {
          locations[0] = data.coords.longitude;
          locations[1] = data.coords.latitude;
          // displayMap(currLocation);
          // console.log(currLocation);
          if (locations[0] == null || locations[1] == null) {
            return alert('Please Provide Your Location');
          }
          const emergencyId = JSON.parse(
            document.getElementById('map').dataset.emergencyid
          );
          console;

          let res = await axios({
            method: 'GET',
            url: `/api/v1/emergencies/${emergencyId}`,
          });
          helpingLocation = res.data.data.location;
          // console.log(res.data);
          try {
            res = await axios({
              method: 'PATCH',
              url: '/api/v1/users/updateMe',
              data: {
                currentLocation: locations,
              },
            });
          } catch (err) {
            console.log(helpingLocation, locations);
            return console.log(err.response);
          }
          help(helpingLocation, locations);
        },
        (error) => {
          // console.log(error);
          return alert('Please Turn On Your GPS !!!');
        },
        {
          enableHighAccuracy: true,
        }
      );
      // console.log(getMyCurrnetLocation());
    } catch (err) {
      return alert(err.response.data.message);
    }
    // console.log(helpingLocation);
    // console.log(locations)
  });
}

let Avengers = document.getElementsByClassName('notifyAvengers__card');
for (let i = 0; i < Avengers.length; i += 1) {
  if (Avengers[i] != null && Avengers[i].children[2].textContent === 'DELETE') {
    Avengers[i].children[2].addEventListener('click', (e) => {
      e.preventDefault();
      avenger('delete', i);
    });
  } else {
    Avengers[i].children[2].addEventListener('click', (e) => {
      e.preventDefault();
      const name = Avengers[i].children[0].value;
      const phoneNumber = Avengers[i].children[1].value;
      if (!isGoodNumber(phoneNumber) || phoneNumber.length != 10) {
        return alert('Please Enter a valid Indian Phone Number');
      }
      const data = {
        name: name,
        phoneNumber: phoneNumber,
      };
      avenger('add', i, data);
    });
  }
}

const resetPasswordForm = document.getElementById('reset-passwordForm');

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    if (password != passwordConfirm) {
      return alert('Enterd Passwords Do not match');
    }
    const url = window.location.href;
    const token = url.split('/');
    // console.log(password, passwordConfirm, token[token.length - 1]);
    resetPassword(password, `${token[token.length - 1]}`);
  });
}

const forgotPasswordForm = document.getElementById('forgotPassword-form');

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

const Police = document.getElementById('Police');
if (Police)
  Police.addEventListener('click', () => {
    const number = document.getElementById('PoliceN');
    number.select();
    document.execCommand('copy');
  });
const Ambulance = document.getElementById('Ambulance');
if (Ambulance)
  Ambulance.addEventListener('click', () => {
    const number = document.getElementById('AmbulanceN');
    number.select();
    document.execCommand('copy');
  });
const Fire = document.getElementById('Fire');
if (Fire)
  Fire.addEventListener('click', () => {
    const number = document.getElementById('FireN');
    number.select();
    document.execCommand('copy');
  });
const NDRF = document.getElementById('NDRF');
if (NDRF)
  NDRF.addEventListener('click', () => {
    const number = document.getElementById('NDRFN');
    number.select();
    document.execCommand('copy');
  });
const Women = document.getElementById('Women');
if (Women)
  Women.addEventListener('click', () => {
    const number = document.getElementById('WomenN');
    number.select();
    document.execCommand('copy');
  });
const Nemergency = document.getElementById('Nemergency');
if (Nemergency)
  Nemergency.addEventListener('click', () => {
    const number = document.getElementById('NemergencyN');
    number.select();
    document.execCommand('copy');
  });

const updateUserDataForm = document.getElementById('updateUserDetails-form');

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    updateUserData(form);
  });
}

const updateUserPasswordForm = document.getElementById('updateUser-password');

if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('current_password').value;
    const password = document.getElementById('new_password').value;
    const passwordConfirm = document.getElementById('confirm_password').value;

    if (password != passwordConfirm) {
      return alert('Entered Passwords do not match');
    }
    updateUserPassword(passwordCurrent, password);
  });
}
const scrollDown = document.getElementsByClassName('btn-scroll__helpline')[0];

if (scrollDown) {
  scrollDown.addEventListener('click', () => {
    window.scrollBy(0, 600);
  });
}
