const express = require("express");
const app = express();
const session = require('express-session');//to store information between links from user
const MongoStore = require('connect-mongo')(session);
const mongoStore = new MongoStore({url: 'mongodb://localhost/mPresent'});
const mongoose = require("mongoose");
const passport = require("passport");//for identification
const minify = require('express-minify');
const compression = require('compression');
const path = require("path");
const fs = require('fs');

app.set("view engine", "ejs");

//connecting to db

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/mPresent", function(err){
  if(err){
		console.log("failed to connect to DB");

	}else{
		console.log("connection success");
	}
});

require("./config/dbConfig.js");
require("./config/passport.js")(passport);

const bodyParser = require("body-parser");

app.use(bodyParser.json());//it now says body works
app.use(session({//set up session to our specifications
  secret: 'secret',
  store: mongoStore,
  saveUninitialized: true,
  resave: true,
  cookie : { secure : false, maxAge : (2 * 60 * 60 * 1000) }
}));//for authenticating users
app.use(passport.initialize());//starts passport
app.use(passport.session());//allows authentication info to pass between pages
app.use(compression());
app.use(minify());
app.use(express.static(__dirname+"/public"));


//have it figure out how many pages are in what
const projectPath = path.join(__dirname+'/views/projects/');
const blogPath = path.join(__dirname+'/views/projects/');

fs.readdir(projectPath, function(err, items) {

    fs.writeFile(path.join(__dirname+"/config/projectPath.json"), JSON.stringify(items), (err, file) => {
      if(err){
        //throw an err,this is bad!
        throw(err);
      }else{
        console.log('projectPath file created');
      }
    });
});

fs.readdir(blogPath, function(err, items) {
    fs.writeFile(path.join(__dirname+"/config/blogPath.json"), JSON.stringify(items), (err, file) => {
      if(err){
        //throw an err,this is bad!
        throw(err);
      }else{
        console.log('projectPath file created');
      }
    });
});


const rtAuth = require("./routes/rtAuth.js");
const rtEyeRemember = require("./routes/rtEyeRemember");

//enabling an offline development mode
if (process.env.OFFLINEMODE === "ON") {
	console.log("OFFLINE DEVELOPER MODE ACTIVATED");
	Object.assign(rtSchedule, require("./offlineMode/rtSchedule.js") );
  Object.assign(rtBudget, require("./offlineMode/rtBudget.js") );
}

app.use("/", rtAuth);
app.use("/eye_remember", rtEyeRemember);

app.use(function(req, res){
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    console.log("redirected", req.url);
    res.redirect("/");
    return;
  }

});

app.listen(5000);
console.log("lift off");
