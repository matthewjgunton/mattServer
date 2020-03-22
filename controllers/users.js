var User = require("../models/users.js");//allows us to search the userbase, and register new ones
var fs = require("fs");
const path = require("path");
var passport = require("passport");//because we cannot pass it through on app.js

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/paper/home',
    failureRedirect: '/paper',
    })

exports.indexPage = function(req, res){
  if (!req.user){
    return res.render("paper/index.ejs");
  }
  return res.status(201).render("paper/home.ejs",{user: req.user});
}

exports.logOut = function(req, res){
  req.logout();
  return res.redirect('/rabbit');
}

exports.homePage = function(req, res){
  if (!req.user){
    return res.redirect("/paper/index");
  }
  return res.status(201).render("paper/home.ejs",{user: req.user});
}
