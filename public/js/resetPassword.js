/*eslint-disable*/
import axios from 'axios';

export const resetPassword = async (password, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password: password,
        passwordConfirm: password,
      },
    });
    if (res.data.status === 'success') {
      alert('Password Changed Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    return alert(err.response.data.message);
  }
};
