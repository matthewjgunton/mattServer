
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users.js');//allows me to store only things I care about, as specified in the model, ont random things passed through

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

    //make it so only I can log on

    process.nextTick(function(){
      User.findOne({'matthew.id': profile.id}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          console.log("returning user", user);
          return done(null, user);
        }else{
          if(profile.name.familyName == "Gunton"){


          console.log('new google user');
          var newUser = new User();
          newUser.matthew.id = profile.id;
          newUser.matthew.token = accessToken;
          newUser.matthew.name.givenName = profile.name.givenName;
          newUser.matthew.name.familyName = profile.name.familyName;
          newUser.matthew.name.fullName = profile.name.givenName+" "+profile.name.familyName;
          newUser.matthew.email = profile.emails[0].value;

          newUser.save(function(err, result){
            if(err){
              throw err;
            }
            else{
              console.log("new google "+result);
              return done(null, newUser);
            }
          })
        }else{
          console.log('somebody besides me tried to access');
          console.log(profile.name.familyName, " ", profile.name.givenName);
          console.log("full profile: ",profile);
          return done("nope");
        }
          //
        }
      })
    })
  }
))


  console.log("passport has loaded");

}
