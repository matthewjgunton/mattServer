const express = require("express");
const app = express();
const server = require('http').createServer(app);
const path = require("path");
const io = require("socket.io")(server);

// rabbit libraries
var session = require('express-session');//to store information between links from user
var MongoStore = require('connect-mongo')(session);
var mongoStore = new MongoStore({url: 'mongodb://localhost/mPresent'});
var passport = require("passport");//for identification

app.set("view engine", "ejs");
const db = require("./db.js");
db.run();


const bodyParser = require("body-parser");

app.use(bodyParser.json());//it now says body works
require("./config/passport.js")(passport);
app.set('etag', false);//prevent caching
app.use(session({//set up session to our specifications
  secret: 'secret',
  store: mongoStore,
  saveUninitialized: true,
  resave: true,
  cookie : { secure : false, maxAge : (2 * 60 * 60 * 1000) }
}));//for authenticating users
app.use(passport.initialize());//starts passport
app.use(passport.session());//allows authentication info to pass between pages

app.use( express.static(__dirname+"/public") );

//have it figure out how many pages are in what
const a = require("./createFiles.js");
const projectPath = path.join(__dirname+'/views/projects/');
const blogPath = path.join(__dirname+'/views/blogs/');
const mediaPath = path.join(__dirname+'/views/media/');

a.createFiles(projectPath, 'projectPath').then( () => {
  a.createFiles(blogPath, 'blogPath').then( () => {
    a.createFiles(mediaPath, 'mediaPath').then (()=> {
      const rtAuth = require("./routes/rtAuth.js");
      const rtEyeRemember = require("./routes/rtEyeRemember");
      const rtRabbit = require("./routes/rtRabbit");
      const rtPaper = require("./routes/rtPaper");
      const ioController = require("./controllers/io.js")(io);
      app.use("/", rtAuth);
      app.use("/eye_remember", rtEyeRemember);
      app.use("/paper", rtPaper);
      app.use("/rabbit", rtRabbit);
      app.locals.io = io
      app.use(function(req, res){
        res.status(404);
        // respond with html page
        if (req.accepts('html')) {
          console.log("redirected", req.url);
          return res.redirect("/");
        }else{
          res.send("Please view Maurelius on a web browser");
        }
      });
      server.listen(5000);
      console.log("lift off");
    })
  })
})


//enabling an offline development mode
// if (process.env.OFFLINEMODE === "ON") {
// 	console.log("OFFLINE DEVELOPER MODE ACTIVATED");
// 	Object.assign(rtSchedule, require("./offlineMode/rtSchedule.js") );
//   Object.assign(rtBudget, require("./offlineMode/rtBudget.js") );
// }
