var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/oneOffs.js");

sendRoutes.route("/")
  .get(controller.library);

sendRoutes.route("/baseConverter")
  .get(controller.baseConverter);




module.exports = sendRoutes;
