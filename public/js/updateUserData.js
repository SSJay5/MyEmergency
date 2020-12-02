/*eslint-disable*/

import axios from 'axios';

export const updateUserData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      alert('Data updated Successfully');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1500);
    }
  } catch (err) {
    return alert(err.response.data.message);
  }
};
