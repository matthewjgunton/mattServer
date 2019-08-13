const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  token: String,
  remindAt: Number,
  boolPatch: Boolean,
  patchLength: Number,
  taken: Boolean,
  id: Number
});

const mattModel = mongoose.model("reminderModel", mPresentSchema);
console.log("reminder model online");
module.exports = mattModel;
