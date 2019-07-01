const fetch = require("node-fetch");
const reminderModel = require("../models/reminderModel");

exports.reminderReceived = (req, res) => {

  console.log(Object.keys(req.body).length);
  if(Object.keys(req.body).length != 2){
    // console.log(req.body.length, "not big enough");
    return res.status(400).json({msg: "bad request!"});
  }

  new reminderModel({
    token: req.body.token.value,
    remindAt: req.body.remindAt.value,
    taken: false,
    active: false
  }).save().then( (proof) => {
    console.log(proof, " we saved it");
    return res.status(201).json({msg: 'success! we saved '+proof.token})
  })
  .catch( (e)=>{
    console.log("error saving reminder",e);
    return res.status(500).json({msg: 'error', e});
  })
}

exports.test = (req, res) => {
  let token = req.body.token;
  sendNotification(token.value).then( (data)=> {
    console.log(data, "hooray");
    return res.status(200).json({msg: 'success', data})
  })
  .catch( (e)=> {
    console.log(e);
    return res.status(500).json({msg: 'error', e})
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
    //>later we'll create a function to grab all the data, for now it's only forward looking
    reminderModel.find({token: tokenId, remindAt: {$gte: a}, taken: false}).sort({remindAt: -1}).then( (data) => {
      return res.status(200).json({msg: 'data for user '+tokenId, data})
    })
    .catch( (e) => {
      return res.status(500).json({msg: 'error getting '+tokenId+"'s data"})
    })
  }
}

exports.wasReminded = (req, res) => {
  //give me the tokenId and the time
  const {tokenId, remindAt} = req.body;

  reminderModel.updateOne({tokenId, remindAt}, {taken: true}).save().then( (data)=>{
    return res.status(201).json({msg: 'successfully checked off '+remindAt+" reminder", data})
  });

}

function isValidToken(token){
  return (
    typeof token === 'string' &&
    (((token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[')) &&
      token.endsWith(']')) ||
      /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token))
  );
}

function sendNotification(token){

  return new Promise((resolve, reject)=> {
    if(!isValidToken(token)){
      reject("invalid token");
    }

    const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

    fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: 'Greetings!',
        body: 'from Maurelius!',
        data: {
          body: 'Greetings from Maurelius!'
        }
      }),
    })
    .then(response => response.json())
    .then( (data) => {
      resolve(data);
    }).catch( (e)=> {
      reject(e);
    })
  })

}
