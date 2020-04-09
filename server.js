const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// Config path to config file
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connecto to Atlas DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log('DB connection successful');
  });

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log(err));

// connect to local database
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((connection) => {
//     console.log('DB connection successful');
//   });

// console.log(app.get('env'));
// console.log(process.env);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
