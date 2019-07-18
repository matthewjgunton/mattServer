var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/auth.js");

sendRoutes.route("/")
  .get(controller.indexPage);

sendRoutes.route("/projects")
  .get(controller.projectPage);

sendRoutes.route("/auth/google")
  .get(controller.googleLogin);

sendRoutes.route("/auth/google/callback")
  .get(controller.googleCallback);


module.exports = sendRoutes;
