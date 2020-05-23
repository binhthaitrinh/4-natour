/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_YiOh5ItHZIRxn3YmLz5m1p8M00s23G9fRg');

export const bookTour = async (tourId) => {
  try {
    // Get session from server
    const session = await axios(
      `http://localhost:7777/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
