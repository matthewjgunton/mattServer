const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  item: String,
  type: String,
  place: String,
  amount: Number,
  month: Number,
  date: Number,
  year: Number
});

const mattModel = mongoose.model("purchasesModel", mPresentSchema);

module.exports = mattModel;
