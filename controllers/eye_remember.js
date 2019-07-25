const fetch = require("node-fetch");
const reminderModel = require("../models/reminderModel");
const schedule = require('node-schedule');



var j = schedule.scheduleJob('00 * * * *', function(){
  //every hour
  console.log('arrived at test');
  let timeNowMili = new Date().getTime();
  let hourPlus = timeNowMili + 1000 * 60 * 60;

  reminderModel.find({remindAt: {$gt: timeNowMili, $lt: hourPlus} } ).sort({remindAt: 1}).then( (data)=> {
    console.log("j'arive",data.length);
    //here's our spinner
    for(let i = 0; i < data.length; i++){
      //we'll need to convert d into seconds, milisceonds is too big for setTimeout
      console.log("reached", data[i]);
      const time = data.remindAt - new Date().getTime();
      // promises.push()
      setTimeout(()=>{preSendNotification(data[i])}, time);
      setTimeout(()=>{preSendNotification(data[i])}, time + 1000 * 60);
      setTimeout(()=>{preSendNotification(data[i])}, time + 2000 * 60);
      setTimeout(()=>{preSendNotification(data[i])}, time + 3000 * 60);
      setTimeout(()=>{preSendNotification(data[i])}, time + 4000 * 60);
    }
  })
});



function preSendNotification(data){

  console.log("activated presend", data);

  // return new Promise ((resolve, reject) => {
    reminderModel.findOne({remindAt: data.remindAt, token: data.token}).then( (confData)=>{
      if(confData.taken){
        return;
        // reject("already taken");
      }
      sendNotification(data).then( (data)=> {
        console.log(data, "hooray sent");
        // resolve("sent!");
      })
      .catch( (e)=> {
        console.log(e, "oh no something is wrong");
        // reject(e);
      })
    } )
  // });
}

exports.reminderReceived = (req, res) => {

  console.log(Object.keys(req.body).length);
  if(Object.keys(req.body).length != 4){
    // console.log(req.body.length, "not big enough");
    return res.status(400).json({msg: "bad request!"});
  }

  let body = {};
  if(req.body.boolPatch.value){
    body = {
      token: req.body.token.value,
      remindAt: req.body.remindAt.value,
      boolPatch: req.body.boolPatch.value,
      patchLength: req.body.patchLength.value,
      taken: false
    }
  }else{
    body = {
      token: req.body.token.value,
      remindAt: req.body.remindAt.value,
      boolPatch: req.body.boolPatch.value,
      taken: false
    }
  }

  new reminderModel(body).save().then( (proof) => {
    console.log(proof, " we saved it");
    return res.status(201).json({msg: 'success! we saved '+proof.token})
  })
  .catch( (e)=>{
    console.log("error saving reminder",e);
    return res.status(500).json({msg: 'error', e});
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
    reminderModel.find({token: tokenId, remindAt: {$gte: a - (1000 * 60 * 7)}, taken: false }).sort({remindAt: 1}).then( (data) => {
      console.log(data.taken, "ought to be false or empty");
      return res.status(200).json({msg: 'data for user '+tokenId, data})
    })
    .catch( (e) => {
      return res.status(500).json({error: true, msg: 'error getting '+tokenId+"'s data"})
    })
  }
}

exports.wasReminded = (req, res) => {
  //give me the tokenId and the time
  const tokenId = req.body.token.value;
  const remindAt = req.body.remindAt.value;

  reminderModel.findOneAndUpdate({token: tokenId, remindAt}, {taken: true})
  .then( (data)=>{
    console.log(data, "here is what we found with the tokenId and remindAt");
    return res.status(201).json({msg: 'successfully checked off '+remindAt+" reminder", data})
  })
  .catch( (e) => {
    console.log(e, "error updating");
    return res.status(500).json({msg: 'error', e});
  })
}

function isValidToken(token){
  return (
    typeof token === 'string' &&
    (((token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[')) &&
      token.endsWith(']')) ||
      /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token))
  );
}

function sendNotification(obj){

  return new Promise((resolve, reject)=> {
    if(!isValidToken(token)){
      reject("invalid token");
    }

    const msg = (obj.boolDrops) ? ("Time to take your drops") : ("Time to patch");

    const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

    fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: obj.token,
        sound: 'default',
        title: 'Eye Remember',
        body: msg,
        data: {
          body: msg
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
