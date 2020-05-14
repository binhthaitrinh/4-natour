const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// const checkID = (req, res, next, val) => {
//   console.log(val);
//   if (val * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  console.log(req.query);
  next();
};

// 2) ROUTE HANDLER
const getAllTours = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  // Make shallow coppy
  // // 1) Filtering
  // const queryObj = { ...req.query };
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];

  // excludeFields.forEach((field) => {
  //   delete queryObj[field];
  // });

  // // 2) Advanced filtering
  // // { duration: { gte: '5' }, difficulty: 'easy' }
  // // { duration: { $gte: '5' }, difficulty: 'easy' }
  // var queryStr = JSON.stringify(queryObj);
  // // console.log(queryStr);

  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // // no await since we use it to later on use sort() or other function
  // // If we use await It will come back with document
  // // right now it is a promise
  // var query = Tour.find(JSON.parse(queryStr));
  // // console.log(query);

  // // 3) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   // console.log(sortBy);
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // // 4) Field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   console.log(fields);
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // // 5. Pagination

  // // convert string to number
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // if (req.query.page) {
  //   // Return number of document
  //   const numTours = await Tour.countDocuments();
  //   if (numTours <= skip) {
  //     // throw error
  //     throw new Error('This page does not exist');
  //   }
  // }

  // query = query.skip(skip).limit(limit);

  // const query = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // also populate guides information
  const tour = await await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // try {

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
  // // const id = req.params.id * 1;

  // // const tour = tours.find((el) => el.id === id);

  // // if (!tour) {
  // //   return res.status(404).json({
  // //     status: 'fail',
  // //     message: 'Invalid ID'
  // //   });
  // // }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     // tour,
  //   },
  // });
});

const createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({})
  // newTour.save()
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
  // try {

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

// Create a checkBody middleware
// Check if body contains name and price property
// if not,send back 400
// const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }

//   next();
// };

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        // sum += 1
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        // 1 for ASC
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // try {

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      // get 1 document for each of the date
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        // To create array, for each tour of same property, push 1 to arr
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        // 0 to hide _id, 1 for show _id
        _id: 0,
      },
    },
    {
      $sort: {
        // desc order
        numTourStarts: -1,
      },
    },
    { $limit: 6 },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
