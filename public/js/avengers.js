/*eslint-disable*/
import axios from 'axios';

export const avenger = async (type, index, data = {}) => {
  if (type === 'add') {
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/avengers',
        data,
      });
      // console.log(res);
      window.setTimeout(() => {
        location.assign('/');
      }, 0);
    } catch (err) {
      return alert(err.response.data.message);
    }
  } else {
    try {
      const user = await axios({
        method: 'GET',
        url: '/api/v1/users/me',
      });
      // console.log(user);
      await axios({
        method: 'DELETE',
        url: `/api/v1/avengers/${user.data.data.user.avengers[index]._id}`,
      });
      window.setTimeout(() => {
        location.assign('/');
      }, 0);
    } catch (err) {
      return alert(err.response.data.message);
    }
  }
};
