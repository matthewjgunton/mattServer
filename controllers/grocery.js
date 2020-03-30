const User = require("../models/groceryUsersModel.js");//allows us to search the userbase, and register new ones
var fs = require("fs");
const path = require("path");

var passport = require("passport");//because we cannot pass it through on app.js

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/grocery/home',
    failureRedirect: '/grocery',
    })

exports.indexPage = function(req, res){
  if (req.user){
    return res.redirect("/grocery/home");
  }
  return res.status(201).render("grocery/index.ejs");
}

exports.logOut = function(req, res){
  if(req.user){
      req.logout();
  }
  return res.redirect('/grocery');
}

exports.homePage = function(req, res){
  if (!req.user){
    return res.redirect("/grocery");
  }
  if(req.user.address === "null"){
    return res.redirect("/grocery/user");
  }
  return res.status(201).render("grocery/home.ejs",{user: req.user});
}

exports.userPage = (req, res) => {
  if (!req.user){
    return res.redirect("/grocery");
  }
  return res.status(201).render("grocery/user.ejs",{user: req.user});
}
