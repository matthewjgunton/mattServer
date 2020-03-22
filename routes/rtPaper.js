var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/paper.js");
const authController = require("../controllers/users.js");

sendRoutes.route("/")
  .get(controller.indexPage);

sendRoutes.route("/home")
  .get(controller.homePage);

sendRoutes.route("/oauth")
  .get(authController.googleLogin);

sendRoutes.route("/oauth/callback")
  .get(authController.googleCallback);

sendRoutes.route("/out")
  .get(authController.logOut);

module.exports = sendRoutes;
