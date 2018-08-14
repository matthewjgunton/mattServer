var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/new.js");

sendRoutes.route("/")
  .get(controller.landing);

sendRoutes.route("/userInfo")
  .get(controller.userInfo);

sendRoutes.route("/getCalendarInfo")
  .get(controller.getCalendarInfo);

sendRoutes.route("/newSubject")
  .post(controller.postNewSubject);

sendRoutes.route("/deleteSubject")
  .post(controller.postDeleteSubject);

module.exports = sendRoutes;
