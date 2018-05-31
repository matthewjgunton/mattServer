const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  subject: String
});

const mattModel = mongoose.model("subjectModel", mPresentSchema);

module.exports = mattModel;
