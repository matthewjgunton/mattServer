
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var User = require('../models/rabbitUsersModel.js');//allows me to store only things I care about, as specified in the model, ont random things passed through
var User = require("../models/momStatUserModel");

var configAuth = require("./auth.js");

module.exports = function(passport){

  //takes the enormous file from db and makes it simple for my server
  passport.serializeUser(function(user, done){
    return done(null, user.id);
  });

  //for when you want to log out, prevents anything from logging you back in
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    })
  });



passport.use(new googleStrategy({
  clientID: configAuth.googleAuth.clientId,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
},
  function(accessToken, refreshToken, profile, done){

    process.nextTick(function(){
      User.findOne({'userid': profile.id}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, user);
        }else{

          // if(profile._json.hd !== 'lehigh.edu'){
          //   console.log("bad google account ",profile.emails[0].value);
          //   return done("Hey, You!\nLOGIN WITH YOUR LEHIGH EMAIL");
          // }

          var newUser = new User();
          newUser.userid = profile.id;
          newUser.token = accessToken;
          newUser.name.givenName = profile.name.givenName;
          newUser.name.familyName = profile.name.familyName;
          newUser.name.fullName = profile.name.givenName+" "+profile.name.familyName;
          newUser.email = profile.emails[0].value;
          // newUser.eggsFound = 0;
          newUser.weights = [
            {image: "A.jpg", score: 0},
            {image: "B.jpg", score: 0},
            {image: "C.jpg", score: 0},
            {image: "D.jpg", score: 0},
            {image: "E.jpg", score: 0},
            {image: "F.jpg", score: 0},
            {image: "G.jpg", score: 0},
            {image: "H.jpg", score: 0},
          ];

          newUser.save(function(err, result){
            if(err){
              throw err;
            }
            else{
              console.log(result.email," registered");
              return done(null, newUser);
            }
          })
        }
      })
    })
  }
))
  console.log("passport has loaded");

}
