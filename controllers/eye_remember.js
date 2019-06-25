const fetch = require("node-fetch");
const reminderModel = require("../models/reminderModel");

exports.reminderReceived = (req, res) => {

  if(req.body.length != 2){
    res.status(400).json({msg: "bad request!"});
  }

  new reminderModel({
    token: req.body.token.value,
    remindAt: req.body.remindAt.value
    taken: false,
    active: false
  }).save().then( (proof) => {
    console.log(proof, " we saved it");
    res.status(201).json({msg: 'success! we saved '+proof.token})
  })
}

exports.tokenReceived = (req, res) => {
  console.log("token!", req.params.tokenId);
  let tokenId = req.params.tokenId;
  if(tokenId == null){
    return res.status(400).json({msg: 'bad request'})
  }else{
    let tdate = new Date();
    let a = tdate.getTime();
    reminderModel.find({token: tokenId, remindAt: {$lte: a}}).then( (data) => {
      return res.status(200).json({msg: 'data for user '+tokenId, data})
    })
    .catch( (e) => {
      return res.status(500).json({msg: 'error getting '+tokenId+"'s data"})
    })
  }
}
