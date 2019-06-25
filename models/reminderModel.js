const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  token: String,
  remindAt: String,
  taken: Boolean,
  active: Boolean
});

const mattModel = mongoose.model("reminderModel", mPresentSchema);

module.exports = mattModel;
