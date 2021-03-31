var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/rabbit.js");

sendRoutes.route("/")
  .get(controller.indexPage);

sendRoutes.route("/oauth")
  .get(controller.googleLogin);

sendRoutes.route("/oauth/callback")
  .get(controller.googleCallback);

sendRoutes.route("/home")
  .get(controller.homePage);

//sendRoutes.route("/foundEgg")
//  .post(controller.foundEgg);

sendRoutes.route("/leaderboard")
  .get(controller.leaderboard);

//sendRoutes.route("/enterEggCodes/:check")
  //.get(controller.enterEggs);//very important this route is shut down before game begins

sendRoutes.route("/out")
  .get(controller.logOut);

module.exports = sendRoutes;
