var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/momStat.js");

sendRoutes.route("/")
  .get(controller.indexPage);

sendRoutes.route("/home")
  .get(controller.entry)
  .post(controller.rank);

sendRoutes.route("/submitInfo")
  .post(controller.addInfo);

sendRoutes.route("/oauth")
  .get(controller.googleLogin);

sendRoutes.route("/oauth/callback")
  .get(controller.googleCallback);

sendRoutes.route("/out")
  .get(controller.logOut);

module.exports = sendRoutes;
