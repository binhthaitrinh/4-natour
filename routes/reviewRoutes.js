const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// set merge params to true
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// Merge params
// POST /tour/123asd/reviews
// POST /reviews
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
