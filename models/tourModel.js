const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour name must have less or equal than 40 char'],
      minlength: [10, 'A tour name must have more than 10 char'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // list of values accepted
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be larger or equal to 1'],
      max: [5, 'Rating cannot before larger than 5'],
      // to return rounded double to request
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only applies to current doc on  CREATE
          return val < this.price;
        },
        // can access input value through {VALUE}
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      // remove white space at beginning and end of input
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      // [longtitude, latitude]
      coordinates: [Number],
      address: String,
      description: String,
    },
    // embded document
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        // type of each of element to be mongoDB Object ID
        type: mongoose.Schema.ObjectId,
        // references between different data sets
        ref: 'User',
      },
    ],
  },
  {
    // to include virtual properties into results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
  return Math.ceil(this.duration / 7);
});

// VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  // name of the field of current model that is stored as ref in Review
  foreignField: 'tour',
  // id is how it's called in this model in the Review model
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: run before .save() and .create(), not one .insertMany
// Create slug for each document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  // next() like for mongodb middleware
  next();
});

// // embed guides into tours for each save
// tourSchema.pre('save', async function (next) {
//   // return list of promises
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   // await to wait for promise to resolve
//   // overide this.guides
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// find and findOne, regex for all string starts with find
tourSchema.pre(/^find/, function (next) {
  // chain another find() to Query Obj
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} millisec`);
  // console.log(doc);
  next();
});

// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// tourSchema.pre('findOne', function (next) {
//   // chain another find() to Query Obj
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
