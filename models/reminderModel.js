const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item


const reminderSchema = new schema ({
  token: String,
  isDrops: Boolean,
  duration: Number,
  days: [String],
  length: Number,
  time: Number,
  timesAsked: Number,
  taken: Number
})

//token is synonymous with user (Expo token)
//isDrops, lets us know what treatment type
//duration is how many hours is being patched, length is how many weeks patient is treating
//time is unix standard time

const mattModel = mongoose.model("reminderModel", reminderSchema);
console.log("reminder model online");
module.exports = mattModel;
