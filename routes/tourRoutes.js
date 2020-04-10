const express = require('express');
const {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tourController');

const tourRouter = express.Router();

// Param middleware
// tourRouter.param('id', checkID);

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

module.exports = tourRouter;
