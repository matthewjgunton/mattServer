const budgetModel = require("../models/budgetSchema.js");
const budgetItemModel = require("../models/budgetItemSchema.js");

exports.budgetHome = function(req, res){

  var dataObj = {};

  budgetItemModel.find({}).then(function(data){
    dataObj.items = data;

    budgetModel.find({}).then(function(budgetData){
      dataObj.budgeted = budgetData;
      res.render("budgetHome", dataObj);
    })


  })


}

exports.postBudgetItem = function(req, res){
  new budgetItemModel({
      itemName: req.body.itemName
  }).save().then(function(data){
    console.log("adding new budget item", data);
    res.redirect("/budget");
  })
}

exports.postBudgetItemEntry = function(req, res){
  //right now we hard code in the date, later, when we allow budgeting in advance, we can change that
  var whole = new Date();
  var year = whole.getFullYear();
  var month = whole.getMonth()+1;

  new budgetModel({
    item: req.body.item,
    budgeted: req.body.budgeted,
    actualed: req.body.actualed,
    month: month,
    year: year
  }).save().then(function(data){
    console.log("adding new budget item entry", data);
    res.redirect("/budget");
  })
}
