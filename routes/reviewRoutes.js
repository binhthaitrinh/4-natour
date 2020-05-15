const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// set merge params to true
const router = express.Router({ mergeParams: true });

// Merge params
// POST /tour/123asd/reviews
// POST /reviews
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
