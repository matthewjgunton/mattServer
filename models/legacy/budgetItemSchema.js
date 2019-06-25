const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  itemName: String,
  type: String
});

const mattModel = mongoose.model("budgetItemModel", mPresentSchema);

module.exports = mattModel;
