
const express = require('express');

const userController = require('../controllers/userController');
const tripController = require('../controllers/tripController');
const sessionController = require('../controllers/sessionController');
const cookieController = require('../controllers/cookieController')

const userRouter = express.Router();

// save a new user
userRouter.post('/signup',
  userController.createUser,
  (req, res) => {
    console.log('--Sending data from userRouter.POST\'s aynonmouns func--');
    // return res.status(200).json(res.locals);
    return res.status(200).json(res.locals);
  }
);

//verify login info
userRouter.post('/login',
    userController.verifyUser,
    (req, res) => {
    console.log('--Sending data from userRouter.GET\'s aynonmouns func--');
    return res.status(200).json(res.locals.user); 
    }
);

// get a user's info
userRouter.get('/:_id',
    userController.getUser,
    (req, res) => {
    console.log('--Sending data from userRouter.GET\'s aynonmouns func--');
    return res.status(200).json(res.locals.userData); //res.locals.userData
    }
);



// update the trip's information

//USE USER ID in URL
userRouter.patch('/:_id',
  // middleware
  userController.updateUserTrips,
  (req, res) => {
    console.log('--Sending data from userRouter.PATCH\'s aynonmouns func--');
    return res.status(200).json(res.locals.updatedUser); //
  }
);

// delete user
userRouter.delete('/:_id',
  userController.deleteUser,
  (req, res) => {
    console.log('--Sending data from charaRouter.DELETE\'s aynonmouns func--');
    return res.status(200).json(res.locals.deletedCharacter); // We need to send back the updated character's object (so the client can re-render)
  }
);

// EXPORT THE ROUTER!!!
module.exports = userRouter;