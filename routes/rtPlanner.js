var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/schedule.js");

sendRoutes.route("/")
  .get(controller.getSchedule)
  .post(controller.postItem);

sendRoutes.route("/subject")
  .post(controller.newSubject);

sendRoutes.route("/hw")
  .post(controller.newHW);

sendRoutes.route("/event")
  .post(controller.newEvent);

sendRoutes.route("/complete")
  .post(controller.completeHW);

sendRoutes.route("/delete")
  .post(controller.deleteHW);



module.exports = sendRoutes;
