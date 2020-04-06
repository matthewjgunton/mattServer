const mongoose = require("mongoose");
const schema = mongoose.Schema;
//create schema and model

const userSchema = new schema({
    userid: String,
    time: String,
    total: Number,
    address: String,
    items: [
      {item: String, amount: Number}
    ],
});

const uModel = mongoose.model("groceryUsers", userSchema);

console.log("groceryUsers model online");
module.exports = uModel;
