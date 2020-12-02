/*eslint-disable*/

import axios from 'axios';

export const updateUserPassword = async (passwordCurrent, password) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm: password,
      },
    });
    if (res.data.status === 'success') {
      alert('Password Changed Successfully');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    return alert(err.response.data.message);
  }
};
