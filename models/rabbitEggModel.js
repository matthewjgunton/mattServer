const mongoose = require("mongoose");
const schema = mongoose.Schema;
//create schema and model

const userSchema = new schema({
    code: String,
    found: Boolean
});

const uModel = mongoose.model("rabbitEggs", userSchema);

console.log("rabbitUsers model online");
module.exports = uModel;
