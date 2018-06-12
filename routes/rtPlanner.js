var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/schedule.js");

sendRoutes.route("/")
  .get(isLoggedIn, controller.getSchedule)
  .post(isLoggedIn, controller.postItem);

sendRoutes.route("/subject")
  .post(isLoggedIn, controller.newSubject);

sendRoutes.route("/hw")
  .post(isLoggedIn, controller.newHW);

sendRoutes.route("/event")
  .post(isLoggedIn, controller.newEvent);

sendRoutes.route("/complete")
  .post(isLoggedIn, controller.completeHW);

sendRoutes.route("/delete")
  .post(isLoggedIn, controller.deleteHW);

sendRoutes.route("/postpone")
  .post(isLoggedIn, controller.postponeHW);

  function isLoggedIn(req, res, next){
    console.log("is logged in? ",req.user);
    if(req.isAuthenticated()){
      console.log("person logged in "+req.user.matthew.name);
      return next();
    }
      res.redirect('/');
  }

module.exports = sendRoutes;
