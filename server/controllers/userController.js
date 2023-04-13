const bcrypt = require('bcryptjs');
const { User, Trip, Session } = require('../models.js');

// helper function to create fileController error objects
// return value will be the object we pass into next, invoking global error handler
const createErr = (errInfo) => {
  const { method, type, err } = errInfo;
  return { 
    log: `userController.${method} ${type}: ERROR: ${typeof err === 'object' ? JSON.stringify(err) : err}`,
    message: { err: `Error occurred in userController.${method}. Check server logs for more details.` }
  };
};

const userController = {};

// CREATE USER
userController.createUser = (req, res, next) => {
  console.log('---We are in createUser in userController.js--');

  const { username, password } = req.body; // verification will hash the password in DB
  // leaving it as user object in hopes that we add a nickname, and then put that in the object too
  // otherwise we could just send back res.locals.username = username
  const newUser = new User({ username, password });

  newUser.save()
    .then(savedUser => {
      res.locals.verified = true;
      const { username, trips , id } = savedUser
      res.locals.user = { username, trips, user_id: id };
      console.log('WE ARE HERE FOR NEW USER' + res.locals.user)
      return next();
    })
    .catch((err) => {
      // Non-unique usernames will return promise status rejected and the error.name will match this string. 
      // This is important information for the user, so the middleware should continue. Frontend should
      // check verfied boolean in every /user/signup fetch respsonse and proceed accordingly
      if (err.name === "MongoServerError") {
        //Just in case this error was thrown for another reason, we want to be able to read it.
        res.locals.user = { username };
        console.log(JSON.stringify(err));
        res.locals.verified = false;
        return next();
      }

      // If the error is from the POST body not including a username or password, the error 
      // will go here as err.name = "ValidationError". Any other error from the request should
      // also go here, including server connection failure related errors. Trying to post to the 
      // database without a good connection yielded err.name = "MongooseError"
        return next(createErr({
        method: 'createUser', 
        // method: `createUser ${JSON.stringify(err.name)}`,
        type: 'adding newUser to mongoDB data',
        err, 
        }));
    });
};

// Thinking of switching to findOne using username for security purposes. They're unique anyways
// Sounds reasonable to me!
// GET USER
userController.getUser = (req, res, next) => {
  console.log('---We are in getUser in userController.js--');

  const { username } = req.body;
  // const { _id } = req.params; // 
  User.findOne({username: username})
  // User.findOneById(_id)
    .then(foundUser => {

      if (foundUser === null) {
        return next(createErr({
            method: 'addUser',
            type: 'retrieving mongoDB user data',
            err: `findOneById(${_id}) returned null`
        }));
      }

      const { username, trips } = foundUser;
      res.locals.userData = { username, trips };
      return next();
    })
    .catch((err) => {
      return next(createErr({
        method: 'getUser',
        type: 'retrieving mongoDB user data',
        err, 
      }));
    });
}

// Verify User
userController.verifyUser = async (req, res, next) => {
  console.log('---We are in getUser in userController.js--');

  const { username, password } = req.body;
  console.log(username, password);
  // Frontend POST body information inclusion error check. Passing undefined into either field will 
  // result the findOne method returning null, resulting in returning verified = false but this
  // check provides info to us that we messed up the POST body
  if (username === undefined || password === undefined) {
    next(createErr({
      method: 'verifyUser',
      type: 'getting user data from request body',
      err: 'userName and/or password weren\'t in req.body',
    }));
  }

  try {

    User.findOne({ username }).exec()
      .then((user) => {
        // res.locals.userid = user._id;
        console.log(user)
        const { username, trips, id } = user;
        bcrypt.compare(password, user.password)
        .then(result => {
          console.log(result)
          if(result === true) {
            res.locals.user = { username, trips, user_id: id };
            res.locals.verified = true;
            // res.locals.isVerified = {message: 'verified'};
          } else {
            res.locals.isVerified = result;
          }
          console.log(res.locals)
          return next();
        })
      })

    //Non-bcrypt below
    // const foundUser = await User.findOne({ username, password }).exec();

    // if (foundUser === null) {
    //   res.locals.verified = false;
    //   console.log('nomatch')
    // } else {
    //   res.locals.verified = true;
    //   const { username, trips, id } = foundUser;
    //   res.locals.user = { username, trips, user_id: id };
    // }
      
    // return next();
    
  } catch (err) {
    return next(createErr({
      method: 'getUser',
      type: 'retrieving mongoDB user data',
      err,
    }));
  }
}

//This method is adding a new trip to the user, not updating trip information

//try to update only users info (like username and trips)

userController.updateUserTrips = async (req, res, next) => {
  console.log('---We are in updateUserTrips in userController.js--');
  // console.log(res.locals.user)
  
  const user_id = req.body.user_id //|| res.locals.user_id;
  const trip_id = req.body.trip_id //|| res.locals.trips_id; // grab the trip
  // const date = req.body.date //|| res.locals.trips.date  // grabs date of trip
  const tripName = req.body.tripName //|| res.locals.trips.tripName // grabs the name of the trip
  
  //TODO
  // Should either error check for trip_id, date, or tripName being undefined here or make them
  // required in the schema. We should at least check for trip_id, maybe the others are ok being null

  const filter = user_id;
  // const update = {tripName: tripName, date: date, trip_id: trip_id }
  // const updateTrip = {trip_id: trip_id}
  // User.update(updateTrip, {$set: {'trips.$.tripName': tripName} } )

  try {
    // find the user based on the Id
    //filter instead of user_id
    const foundUser = await User.findById(filter).exec()
    
    // const updatedUser = await User.update(update)
    
    if (foundUser === null) {
      return next(createErr({
          method: 'updateUserTrips',
          type: 'retrieving mongoDB user data',
          err: `findOneById(${user_id}) returned null`
      }));
    }

    const userTripsArray = foundUser.trips; //Trips array within the user

    for(let i = 0; i < userTripsArray.length; i++){
      // console.log(userTripsArray[i]._id)
      // console.log(trip_id)
      let cacheID = userTripsArray[i]._id;
      // console.log("THIS IS THE" + cacheID)
      // console.log(cacheID.valueOf()) //object right now
      // console.log(trip_id) //string right now
      if(cacheID.valueOf() === trip_id){
        // console.log("ENETERED IF STATEMENT")
        userTripsArray[i].tripName = tripName;
        userTripsArray[i].date = date;
      }
    }

    foundUser.trips = userTripsArray;

    // console.log(foundUser.trips)
    // const update = req.body; //Information that we want to udpate with

    // const updatedUser = await User.findByIdAndUpdate(trip_id, update, { new: true })

    // foundUser.trips.push({ tripName: tripName, date: date, trip_id: trip_id})
    const updatedUser = await foundUser.save();

    if (updatedUser === null) {
      return next(createErr({
          method: 'updateUserTrips',
          type: 'updating mongoDB user trips data',
          err: `findById(${filter}) returned null`
      }))
    }

    res.locals.updatedUser = updatedUser;
    // console.log("WE ARE HERE UDPATING " + res.locals.updatedUser)
    return next();

  } catch (err) {
    return next(createErr({
      method: 'updateUserTrips',
      type: 'retrieving mongoDB user data or updating mongoDB user trips data',
      err, 
      }));
  }
}

// DELETE USER

userController.deleteUser = (req, res, next) => {
  console.log('---We are in deleteUser in userController.js----');

  const { _id } = req.params;
  console.log(_id);

  User.findByIdAndDelete(_id)
    .then(user => {
      console.log(user);
      const { username, password, trips } = user;
      res.locals.deletedUser = { username, password, trips };
      return next();
    })
    .catch((err) => {
      return next(createErr({
        method: 'deleteUser',
        type: 'retrieving mongoDB data',
        err,
        err,
      }));
    });
};


// EXPORT THE Controllers!!!
module.exports = userController;