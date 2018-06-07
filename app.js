var express = require("express");
var app = express();
var session = require('express-session');//to store information between links from user
var MongoStore = require('connect-mongo')(session);
var mongoStore = new MongoStore({url: 'mongodb://localhost/mPresent'});
const mongoose = require("mongoose");
var passport = require("passport");//for identification

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

var bodyParser = require("body-parser");
var urlencoderParser = bodyParser.urlencoded({extended:false});

app.use(urlencoderParser);//it now says body works
app.use(session({//set up session to our specifications
  secret: 'secret',
  store: mongoStore,
  saveUninitialized: true,
  resave: true,
  cookie : { secure : false, maxAge : (2 * 60 * 60 * 1000) }
}));//for authenticating users
app.use(passport.initialize());//starts passport
app.use(passport.session());//allows authentication info to pass between pages

app.use(express.static(__dirname+"/public"));

const rtAuth = require("./routes/rtAuth.js");
app.use("/", rtAuth);

const rtSchedule = require("./routes/rtPlanner.js");
app.use("/schedule", rtSchedule);

const rtBudget = require("./routes/rtBudget.js");
app.use("/budget", rtBudget);

const rtOneOffs = require("./routes/rtOneOffs.js");
app.use("/mprojects", rtOneOffs);

app.listen(5000);
console.log("lift off");
