import axios from 'axios';
import { showAlert } from './alerts';

// type is password or regular info
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? 'updateMyPassword' : 'updateMe';

    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:7777/api/v1/users/${url}`,
      data,
    });

    console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      window.setTimeout(() => location.reload(true), 2500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
