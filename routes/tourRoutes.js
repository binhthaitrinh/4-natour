const express = require('express');
const {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
// const reviewController = require('../controllers/reviewController');

const tourRouter = express.Router();

// Param middleware
// tourRouter.param('id', checkID);

// mounting a router
tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/tour-stats').get(getTourStats);

tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(authController.protect, getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  )
  .patch(updateTour);

module.exports = tourRouter;
