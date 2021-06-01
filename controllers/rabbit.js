var User = require("../models/rabbitUsersModel.js");//allows us to search the userbase, and register new ones
var Egg = require("../models/rabbitEggModel.js");
var fs = require("fs");
const path = require("path");


var passport = require("passport");//because we cannot pass it through on app.js

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: '/rabbit/home',
    failureRedirect: '/rabbit',
    })

exports.indexPage = function(req, res){
  if (!req.user){
    return res.render("rabbit/index.ejs");
  }
  return res.redirect("/rabbit/home");
}

exports.logOut = function(req, res){
  req.logout();
  return res.redirect('/rabbit');
}

exports.homePage = function(req, res){
  if (!req.user){
    return res.redirect("/rabbit/index");
  }
  return res.status(201).render("rabbit/home.ejs",{user: req.user, csrfToken: req.csrfToken()});
}

exports.leaderboard = (req, res) => {
  if(!req.user) return res.status(400).json({e: "no"});
  User.find({}).sort({'eggsFound': -1}).limit(10).exec(function(err, data){
    if(err) return res.status(400).json({msg: "Bad request!"});
    let obj = JSON.parse(JSON.stringify(data));
    for(let i = 0; i < obj.length; i++){
	delete obj[i]._id;
	delete obj[i].token;
	delete obj[i].userid;
    }
    return res.status(200).json({data: obj, msg: "success!"});
  })
}

exports.foundEgg = (req, res) => {

  if(Object.keys(req.body).length != 2 || !req.user){
    console.log("no user or body length not 2");
    return res.status(400).json({msg: "bad request!"});
  }

  let digitVal = 11;
  for(let i = 0; i < req.body.code.length; i++){
    digitVal += req.body.code.charCodeAt(i);
  }
  if(digitVal % 11 != 2){
    console.log("Safety check bad request");
    return res.status(400).json({msg: "bad request!"});
  }
  //now we know it's a good code, we look up the kid and give him the points
  User.findOne({userid: req.user.userid}).then((data)=>{
    if(!data){
	console.log("no user found bad request");
      return res.status(400).json({msg: "bad request!"});
    }
    Egg.findOne({code: req.body.code}).then((eggData)=>{
      if(!eggData){
        return res.status(400).json({msg: "nse"});
      }
      if(eggData.found){
        return res.status(400).json({msg: "fAl"});
      }
      let newEggsFound = data.eggsFound+1;
      User.findOneAndUpdate({userid: req.user.userid}, {eggsFound: newEggsFound}).then(()=>{
        Egg.findOneAndUpdate({code: req.body.code}, {found: true}).then(()=>{
          console.log(req.user.email," found egg: ",req.body.code);
          return res.status(201).json({msg: "success!"});
        }).catch((e)=>{
          console.log("internal error updating egg info on egg");
          return res.status(400).json({msg: "bad request!"});
        })
      }).catch((e)=>{
        console.log("internal error updating egg info on user");
        return res.status(400).json({msg: "bad request!"});
      })
    }).catch((e)=>{
      console.log("internal error finding egg");
      return res.status(400).json({msg: "bad request!"});
    })
  })
  .catch((e)=>{
    console.log("internal error finding user");
    return res.status(400).json({msg: "bad request!"});
  })
}

exports.enterEggs = (req, res) => {

  if(req.params.check != 1312020523){
    return res.status(400).json({msg: "bad request"});
  }

  var contents = fs.readFileSync(path.resolve(__dirname, '../config/data.json'));
  let eggCodes = JSON.parse(contents);
  let promises = [];
  for(let i = 0; i < eggCodes.length; i++){
    let obj = new Egg({code: eggCodes[i].code, found: false});
    promises.push(obj.save());
  }

  Promise.all(promises).then((value)=>{
    return res.status(200).json({msg: "success!"});
  }).catch((e)=>{
    return res.status(500).json({msg: "bad:",e});
  })


}
