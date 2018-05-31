const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  subject: String,
  assignmentName: String,
  monthDue: Number,
  dayDue: Number,
  yearDue: Number,
  assignmentDescription: String,
  isCompleted: Boolean,
  isHandedIn: Boolean,
  isCancelled: Boolean
});

const mattModel = mongoose.model("hwModel", mPresentSchema);

module.exports = mattModel;
