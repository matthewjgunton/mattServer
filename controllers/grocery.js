const User = require("../models/groceryUsersModel.js");//allows us to search the userbase, and register new ones
var fs = require("fs");
const path = require("path");

var passport = require("passport");//because we cannot pass it through on app.js
var braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'your_merchant_id',
  publicKey: 'your_public_key',
  privateKey: 'your_private_key'
});


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

const fruit = ["Apple", "Orange", "Blueberry", "Strawberry", "Raspberry", "Blackberry", "Banana"];
const fruitPrices = [1,1,1,1,1,1,1];
const vegetable = ["Potato", "Asparagus", "Red Pepper", "Green Pepper", "Tomato", "Carrot", "Mushroom"];
const vegetablePrices = [1,1,1,1,1,1,1];
const bread = ["Whole Wheat Bread", "White Bread", "Italian Bread", "Potato Bread", "Artisanal Bread"];
const breadPrices = [1,1,1,1,1];
const drink = ["Milk", "Orange Juice", "Apple Juice", "Capri Sun", "Sports Drink", "Root Beer", "Monster Energy", "Coffee", "Coca-Cola", "Sprite"];
const drinkPrices = [1,1,1,1,1,1,1,1,1,1];

exports.shopPage = (req, res)=>{
  if (!req.user){
    return res.redirect("/grocery");
  }
  gateway.clientToken.generate({}, function (err, response) {
    return res.status(201).render("grocery/shop.ejs",{user: req.user, token: response.clientToken, data: [fruit, fruitPrices, vegetable, vegetablePrices, bread, breadPrices, drink, drinkPrices]});
  });
}

exports.checkout = (req, res)=>{
  if (!req.user){
    return res.redirect("/grocery");
  }
  var nonce = req.body.payment_method_nonce;
  var amount = req.body.amount;
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }).then(function (result) {
    if (result.success) {
      console.log('Transaction ID: ' + result.transaction.id);
      return res.status(201).redirect("/grocery");
    } else {
      console.error(result.message);
    }
  }).catch(function (err) {
    console.error(err);
    return res.status(400).redirect("/grocery");
  });
}

exports.updateUser = (req, res) => {

  if(!req.user || Object.keys(req.body).length > 3 || Object.keys(req.body).length < 2){
    return res.status(400).json({msg: "bad request!"});
  }

  //put in check to make sure the user is in lville (ZIP code within range)
  User.findOneAndUpdate({email: req.user.email}, {address: req.body.address, instruction: req.body.instruction, phone: req.body.phone}).then(()=>{
    return res.status(201).json({msg: "success"});
  }).catch((err)=>{
    return res.status(400).json({msg: "failed"});
    console.log("Failed: ",err);
  })

}
