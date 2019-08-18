var User = require("../models/users.js");//allows us to search the userbase, and register new ones
var passport = require("passport");//because we cannot pass it through on app.js

const projectPath = require("../config/projectPath.json");
const blogPath = require("../config/blogPath.json");

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    })

exports.indexPage = function(req, res){
  res.status(200).render('index');
}

exports.speedTest = (req, res) => {
  //timezone is east coast
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let seconds = date.getSeconds();
  return res.status(200).json({hour, minute, seconds, date});
}

exports.projectPage = (req, res) => {
    res.status(200).render('projects');
}

exports.projectSpecific = (req, res) => {
  let a = req.params.project;
  for(let i = 0; i < projectPath.length; i++){
    let test = projectPath[i].substring(0, projectPath[i].indexOf('.'));
    if(a === test){
      return res.status(200).render('projects/'+a);
      break;
    }
    if(i == projectPath.length - 1){
      return res.status(200).redirect('/projects');
      break;
    }
  }
}

exports.blogPage = (req, res) => {
  res.status(200).render('blog');
}

exports.blogSpecific = (req, res) => {

  let a = req.params.num;
  for(let i = 0; i < blogPath.length; i++){
    let test = blogPath[i].substring(0, blogPath[i].indexOf('.'));
    if(a === test){
      return res.status(200).render('blogs/'+a);
      break;
    }
    if(i == projectPath.length - 1){
      return res.status(200).redirect('/blog');
      break;
    }
  }
}

exports.mediaPage = (req, res) => {
  res.status(200).render('media');
}
