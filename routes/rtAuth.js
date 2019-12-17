var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/auth.js");

sendRoutes.route("/")
  .get(controller.indexPage);

sendRoutes.route("/speed")
  .get(controller.speedTest);

sendRoutes.route("/projects")
  .get(controller.projectPage);

sendRoutes.route("/projects/:project")
  .get(controller.projectSpecific);

sendRoutes.route("/blog")
  .get(controller.blogPage);

sendRoutes.route("/blog/:num")
  .get(controller.blogSpecific);

sendRoutes.route("/media")
  .get(controller.mediaPage);

  sendRoutes.route("/media/:num")
    .get(controller.mediaSpecific);




module.exports = sendRoutes;
