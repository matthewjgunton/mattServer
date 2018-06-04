var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

var controller = require("../controllers/budget.js");

sendRoutes.route("/")
  .get(isLoggedIn, controller.budgetHome);

sendRoutes.route("/newBudgetItem")
  .post(isLoggedIn, controller.postBudgetItem);

sendRoutes.route("/newBudgetItemEntry")
  .post(isLoggedIn, controller.postBudgetItemEntry);

sendRoutes.route("/budgetTracker")
  .get(isLoggedIn, controller.budgetTracker)
  .post(isLoggedIn, controller.budgetTrackerPost);

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      console.log("person logged in "+req.user.matthew.name);
      return next();
    }
      res.redirect('/')
  }

module.exports = sendRoutes;
