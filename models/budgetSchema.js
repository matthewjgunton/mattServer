const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  item: String,
  type: String,
  budgeted: Number,
  actualed: Number,
  month: Number,
  year: Number
});

const mattModel = mongoose.model("budgetModel", mPresentSchema);

module.exports = mattModel;
