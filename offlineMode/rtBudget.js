var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/budget.js");

sendRoutes.route("/")
  .get(controller.budgetHome);

sendRoutes.route("/newBudgetItem")
  .post(controller.postBudgetItem);

sendRoutes.route("/newBudgetItemEntry")
  .post(controller.postBudgetItemEntry);

sendRoutes.route("/budgetTracker")
  .get(controller.budgetTracker)
  .post(controller.budgetTrackerPost);

module.exports = sendRoutes;
