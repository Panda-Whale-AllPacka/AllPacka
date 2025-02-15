const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
dotenv.config();


// Routers
const userRouter = require('./routes/userRouter');
const tripRouter = require('./routes/tripRouter');

const PORT = 1234;
const app = express();

const cookieController = require('./controllers/cookieController');
app.use(cookieParser());

// Parse all requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // important for forms!!

// const MONGO_URI = process.env.MARK_ALLPACKADB_MONGO_URL;

const MONGO_URI =
  'mongodb+srv://timmy:allpacka@iteration.k9ltgco.mongodb.net/?retryWrites=true&w=majority';
// const MONGO_URI ="mongodb+srv://markteets:YpbIlMkXeLofYQrV@allpackadb.79xwnq2.mongodb.net/?retryWrites=true&w=majority"
// const MONGO_URI = process.env.MARK_ALLPACKADB_MONGO_URL;

// const MONGO_URI = 'error maker'

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true, // useful boiler plate
    useUnifiedTopology: true, // more useful boiler plate
    // sets the name of the DB that our collections are part of
    dbName: 'AllPAcka',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err)); // super nice for de-bugging

// define route handlers

app.use('/api/user', userRouter, cookieController.setCookie); // Access to trips from here

app.use('/api/trip', tripRouter); // The main infographic page

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("Big ol' fail"));

app.use((err, req, res, next) => {
  // this is the default error obj
  console.log('We have entered the twightlight Zone!');
  res.locals.message = err.message;
  console.log('Our error log is: ', err.log);
  // console.log('Our error message is: ', err.message);
  const errorStatus = err.status || 500;
  return res.status(errorStatus).send(res.locals.message);
});

//  start server
app.listen(PORT, () => {
  console.log(`Beep boop: Server listening on port: ${PORT}`);
});
