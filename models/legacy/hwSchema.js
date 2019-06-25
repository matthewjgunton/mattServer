const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  // item:{
  //   type: schema.Types.ObjectId,
  //   ref: "subjectModel"
  // },
  subject: String,
  assignmentName: String,
  monthDue: Number,
  dayDue: Number,
  dueDate: String,
  assignmentDescription: String,
  isCompleted: Boolean,
  isHandedIn: Boolean,
  isCancelled: Boolean,
  isPostponedForToday: Boolean,
}, {timestamps: true});

const mattModel = mongoose.model("hwModel", mPresentSchema);

module.exports = mattModel;
