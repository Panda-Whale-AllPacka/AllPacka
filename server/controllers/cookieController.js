
///////////// Stretch feature /////////////////
const cookieController = {};

/**
* setSSIDCookie - store the user's databasse _id in a cookie and seesion db
*/
cookieController.setCookie = (req, res, next) => {
  res.cookie('secret', Math.floor(Math.random()*100));
  return next();
}

cookieController.setSSIDCookie = (req, res, next) => {
  // write code here
  // console.log(res.locals._id);
  // res.setHeader('Set-Cookie', `ssid=${res.locals._id}; HttpOnly`); // <-- Example
  res.cookie('ssid', res.locals.user.user_id, { httpOnly: true });
  return next();
}


module.exports = cookieController;