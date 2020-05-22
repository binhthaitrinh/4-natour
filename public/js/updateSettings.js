import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    console.log('asdasd');
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:7777/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully');
      window.setTimeout(() => location.reload(true), 2500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
