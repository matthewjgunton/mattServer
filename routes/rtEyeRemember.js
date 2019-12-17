var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/eye_remember.js");


sendRoutes.route("/create")
  .post(controller.create);

sendRoutes.route("/delete")
  .post(controller.delete);

sendRoutes.route("/update")
  .post(controller.update);

sendRoutes.route("/update/taken")
  .post(controller.updateTaken)

sendRoutes.route("/update/removeFromPatchQueue")
  .post(controller.updateRemoveFromPatchQueue)

sendRoutes.route("/read")
  .post(controller.read);

sendRoutes.route("/read/alarm")
  .post(controller.readAlarm);

sendRoutes.route("/read/records")
  .post(controller.readRecords);

module.exports = sendRoutes;
