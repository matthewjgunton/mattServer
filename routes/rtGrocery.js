var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/grocery.js");

sendRoutes.route("/")
  .get(controller.indexPage);

sendRoutes.route("/oauth")
  .get(controller.googleLogin);

sendRoutes.route("/oauth/callback")
  .get(controller.googleCallback);

sendRoutes.route("/home")
  .get(controller.homePage);

sendRoutes.route("/user")
  .get(controller.userPage);

sendRoutes.route("/out")
  .get(controller.logOut);

module.exports = sendRoutes;
