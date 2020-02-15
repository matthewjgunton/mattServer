const mongoose = require("mongoose");
const schema = mongoose.Schema;
//create schema and model

const userSchema = new schema({
    userid: String,
    token: String,
    email: String,
    name: {
      givenName: String,
      familyName: String,
      fullName: String
    }
});

const uModel = mongoose.model("rabbitUsers", userSchema);

console.log("rabbitUsers model online");
module.exports = uModel;
