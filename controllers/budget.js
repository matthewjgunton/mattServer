const budgetModel = require("../models/budgetSchema.js");
const budgetItemModel = require("../models/budgetItemSchema.js");
const purchasesModel = require("../models/purchasesModel.js");

const config = require("../config/config.json");

exports.budgetHome = function(req, res){

  var dataObj = {};
  var monthsArray = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

  var whole = new Date();
  var month = whole.getMonth();

  dataObj.pages = config.pages;

  dataObj.month = monthsArray[month];

  budgetItemModel.find({}).then(function(data){
    dataObj.items = data;

    budgetModel.find({}).then(function(budgetData){
      dataObj.budgeted = budgetData;
      console.log(dataObj.budgeted);
      res.render("budgetHome", dataObj);
    })


  })

}

exports.budgetTracker = function(req, res){
  console.log("reached");
  var dataObj = {};
  budgetItemModel.find({}).then(function(data){
    dataObj.categories = data;
    res.render("budgetTrackerView", dataObj);
  })

}

exports.budgetTrackerPost = function(req, res){

  var whole = new Date();
  var year = whole.getFullYear();
  var month = whole.getMonth()+1;

  budgetModel.find({item: req.body.item, month: month}).then(function(data){
    if(!data.actualed){
      var newActualed = req.body.amount;
    }else{
      var newActualed = data.actualed + req.body.amount;
    }
    console.log(newActualed, "new amount");

    budgetModel.findOneAndUpdate({item: req.body.category, month: month}, {
      actualed: newActualed
    }).then(function(){
      new purchasesModel({
        item: req.body.category,
        place: req.body.place,
        amount: req.body.amount,
        month: month,
        year: year
      }).save().then(function(purchaseData){
        console.log("we saved this data", purchaseData);
        res.redirect("/budget");
      })
    })
  })

}

exports.postBudgetItem = function(req, res){
  new budgetItemModel({
      itemName: req.body.itemName,
      type: req.body.type
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
