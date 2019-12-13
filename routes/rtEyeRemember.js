var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/eye_remember.js");


sendRoutes.route("/create")
  .post(controller.create);

sendRoutes.route("/delete")
  .post(controller.create);

sendRoutes.route("/update")
  .post(controller.update);

sendRoutes.route("/update/taken")
  .post(controller.updateTaken)

sendRoutes.route("/read")
  .post(controller.read);

sendRoutes.route("/read/alarm")
  .post(controller.readAlarm);

sendRoutes.route("/read/records")
  .post(controller.readRecords);


/////////////////////////
// old
// sendRoutes.route("/token/:tokenId")
//   .get(controller.tokenReceived);
//
// sendRoutes.route("/records")
//   .post(controller.reminderReceived);
//   //make a get request here for the full records
//
// sendRoutes.route("/records/:tokenId")
//   .get(controller.sendFullRecordsEJS);
//
// sendRoutes.route("/json/:tokenId")
//   .get(controller.sendFullRecordsJSON);
//
// sendRoutes.route("/delete")
//   .post(controller.deleteAlarm);
//
// sendRoutes.route("/treated")
//   .post(controller.wasReminded);

module.exports = sendRoutes;
