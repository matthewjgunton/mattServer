const mongoose = require("mongoose");
const schema = mongoose.Schema;


//create schema and model

const userSchema = new schema({
  matthew:{
    provider: String,
    id: String,
    token: String,
    email: String,
    name: {
      givenName: String,
      familyName: String,
      fullName: String
    }
  }
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

//***only needed if you allow local login
// //THIS FUNCTION TAKES NORMAL PASSWORD AND ENCRYPTS IT
// userSchema.methods.generateHash = function(password){
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(9));//makes all saved passwords unique, so 'abc123' can be used by many people, but saved all uniquely
// }
//
// //THIS FUNCTION ENCRYPTS THE USER INPUT AND COMPARES IT TO THE ONE IN THE DB
// userSchema.methods.validPassword = function(password){
//   return bcrypt.compareSync(password, this.local.password);
// }

const uModel = mongoose.model("users", userSchema);

console.log("user model online");
module.exports = uModel;
