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
    },
    gender: String,
    age: Number,
    personalMisalignment: Number,
    familialMisalignment: Number,
    weights: [
      {
        image: String,
        score: Number
      }
    ]
});

const uModel = mongoose.model("momStatUser", userSchema);

console.log("rabbitUsers model online");
module.exports = uModel;
