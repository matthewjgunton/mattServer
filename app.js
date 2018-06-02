var express = require("express");
var app = express();

app.set("view engine", "ejs");

//connecting to db
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/mPresent", function(err){
  if(err){
		console.log("failed to connect to DB");

	}else{
		console.log("connection success");
	}
});

require("./dbConfig.js");

var bodyParser = require("body-parser");
var urlencoderParser = bodyParser.urlencoded({extended:false});
app.use(urlencoderParser);//it now says body works

app.use(express.static(__dirname+"/public"));

const rtSchedule = require("./routes/rtPlanner.js");
app.use("/", rtSchedule);

const rtBudget = require("./routes/rtBudget.js");
app.use("/budget", rtBudget);

const rtOneOffs = require("./routes/rtOneOffs.js");
app.use("/mprojects", rtOneOffs);

app.listen(5000);
console.log("lift off");
