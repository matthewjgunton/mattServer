var User = require("../models/rabbitUsersModel.js");//allows us to search the userbase, and register new ones

var passport = require("passport");//because we cannot pass it through on app.js

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/rabbit/home',
    failureRedirect: '/rabbit',
    })

exports.indexPage = function(req, res){
  res.render("rabbit/index.ejs");
}

exports.homePage = function(req, res){
  res.render("rabbit/home.ejs");
}
