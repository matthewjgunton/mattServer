var User = require("../models/users.js");//allows us to search the userbase, and register new ones

var passport = require("passport");//because we cannot pass it through on app.js

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    })

exports.indexPage = function(req, res){
  res.render("index");
}
