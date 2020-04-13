const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Config path to config file
dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION. SHUTTING DOWN...');

  process.exit(1);
});

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
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Handle all promise rejection
// act like the last safety net
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! Shutting down...');
  // 0 for success, 1 for uncaught exception
  // .close() to finish executing current processes
  server.close(() => {
    process.exit(1);
  });
});
