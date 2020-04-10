class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach((field) => {
      delete queryObj[field];
    });

    // 2) Advanced filtering
    // { duration: { gte: '5' }, difficulty: 'easy' }
    // { duration: { $gte: '5' }, difficulty: 'easy' }

    var queryStr = JSON.stringify(queryObj);

    // console.log(queryStr);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // no await since we use it to later on use sort() or other function
    // If we use await It will come back with document
    // right now it is a promise
    // var query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 4) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 5. Pagination

    // convert string to number
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // if (this.queryString.page) {
    //   // Return number of document
    //   const numTours = await Tour.countDocuments();
    //   if (numTours <= skip) {
    //     // throw error
    //     throw new Error('This page does not exist');
    //   }
    // }

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
