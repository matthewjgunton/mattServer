var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/budget.js");


//we need to add in the infrastructure on front end to move between pages


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
