const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  eventName: String,
  month: Number,
  day: Number,
  year: Number,
  eventDescription: String,
  isCancelled: Boolean
});

const mattModel = mongoose.model("eventModel", mPresentSchema);

module.exports = mattModel;
