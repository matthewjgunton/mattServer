var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/eye_remember.js");

sendRoutes.route("/token/:tokenId")
  .get(controller.tokenReceived);

sendRoutes.route("/records")
  .post(controller.reminderReceived);
  //make a get request here for the full records

sendRoutes.route("/test")
  .get(controller.test);

sendRoutes.route("/treated")
  .post(controller.wasReminded);

module.exports = sendRoutes;
