var User = require("../models/momStatUserModel.js");//allows us to search the userbase, and register new ones
var fs = require("fs");
const path = require("path");
var passport = require("passport");//because we cannot pass it through on app.js

const route = "/statistics";

exports.logOut = function(req, res){
  req.logout();
  return res.redirect(route);
}

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
    successRedirect: route+'/home',
    failureRedirect: route,
    })

exports.indexPage = function(req, res){
  if (req.user){
    return res.redirect(route+"/home");
  }
  return res.render("momStat/index.ejs", {rt: route});
}

function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i].score < pivot) {
            i++;
        }
        while (items[j].score > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

exports.entry = async function(req, res){

  if(!req.user){
    return res.redirect(route);
  }

  let strippedUser = {};
  strippedUser.fullName = req.user.name.fullName;
  if(typeof req.user.age === 'undefined'){
    return res.render("momStat/gatherInfo.ejs", {rt: route, user: strippedUser, csrfToken: req.csrfToken()});
  }

  try{
    const userData = await User.findOne({_id: req.user._id});
    if(userData === null) return res.redirect(route);

    if(userData.weights[0].score != 0){
      return res.send("Thank you for taking the survey! Your responses have been recorded!");
    }

    return res.render("momStat/survey", {rt: route, user: strippedUser, csrfToken: req.csrfToken(), images: userData.weights});
  }catch(e){
    console.log("Exception ",e);
    return res.status(400).json({msg: "bad request!"});
  }

}

exports.rank = async (req, res) => {
    if(!req.user) return res.status(400).json({msg: "bad request!"});
    const {images} = req.body;
    console.log(req.body);

    try{
      const user = await User.findOne({_id: req.user._id}).lean();
      if(user === null) return res.status(400).json({msg: "bad request!"});

      let updatedWeights = [];
      for(let i = 0; i < user.weights.length; i++){
        updatedWeights[i] = JSON.parse(JSON.stringify(user.weights[i]));
      }

      for(let i = 0; i < images.length; i++){
        for(let j = 0; j < updatedWeights.length; j++){
          if( images[i] === updatedWeights[j].image ){
            updatedWeights[j].score = (i+1);
          }
        }
      }

      let control = await User.findOneAndUpdate({_id: req.user._id}, {weights: updatedWeights});
      if(control === null) return res.status(400).json({msg: "bad request!"});

    }catch(e){
      console.log("Exception updating user info", e);
      return res.status(400).json({msg: "bad request!"});
    }

    return res.status(201).json({msg: "success!"});
}

exports.addInfo = async function(req, res){
  if(!req.user) return res.status(400).json({msg: "bad request!"});

  const {age, gender, personalMisalignment, familialMisalignment} = req.body;
  if(age < 18) return res.status(400).json({msg: "bad request!"});
  if(gender !== "f" && gender !== "m" && gender !== "p" && gender !== "o") return res.status(400).json({msg: "bad request!"});
  if(personalMisalignment > 1 || familialMisalignment > 1) return res.status(400).json({msg: "bad request!"});
  if(personalMisalignment < 0 || familialMisalignment < 0) return res.status(400).json({msg: "bad request!"});

  try{
    const user = await User.findOneAndUpdate({_id: req.user._id},{gender, age, personalMisalignment, familialMisalignment}, {upsert: false});
    if(user === null) return res.status(400).json({msg: "bad request!"});
  }catch(e){
    console.log("Exception updating user info", e);
    return res.status(400).json({msg: "bad request!"});
  }

  return res.status(201).json({msg: "success!"});


}
