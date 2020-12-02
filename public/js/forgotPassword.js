/*eslint-disable*/

import axios from 'axios';

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotpassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      alert('Token was sent to your Email Successfully');
    }
  } catch (err) {
    return alert(err.response.data.message);
  }
};
