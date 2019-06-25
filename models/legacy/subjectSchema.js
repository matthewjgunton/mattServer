const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema for each item

const mPresentSchema = new schema ({
  subject: String,
  item:{
    type: schema.Types.ObjectId,
    ref: "hwModel"
  },
});

const mattModel = mongoose.model("subjectModel", mPresentSchema);

module.exports = mattModel;
