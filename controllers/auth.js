var User = require("../models/users.js");//allows us to search the userbase, and register new ones
var path = require("path");
var passport = require("passport");//because we cannot pass it through on app.js

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    })

exports.indexPage = function(req, res){
  res.status(200).sendFile(path.join(__dirname+'/../views/index.html'));
}

exports.projectPage = (req, res) => {
  res.status(200).sendFile(path.join(__dirname+'/../views/projects.html'));
}

exports.projectSpecific = (req, res) => {
  console.log(req.params.project);
  let a = req.params.project;
  res.status(200).sendFile(path.join(__dirname+'/../views/projects/'+a+'.html'));
}
