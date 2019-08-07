const fetch = require("node-fetch");
const reminderModel = require("../models/reminderModel");
const schedule = require('node-schedule');
const path = require("path");

var rule = new schedule.RecurrenceRule();
rule.minute = 17;

var j = schedule.scheduleJob(rule, function(){
  //every hour
  console.log('arrived at test');
  let timeNowMili = new Date().getTime();
  let hourPlus = timeNowMili + 1000 * 60 * 60;

  reminderModel.find({remindAt: {$gt: timeNowMili, $lt: hourPlus} } ).sort({remindAt: 1}).then( (data)=> {
    console.log("j'arive",data.length, timeNowMili+" patrol");
    //here's our spinner
    for(let i = 0; i < data.length; i++){
      //we'll need to convert d into seconds, milisceonds is too big for setTimeout
      const time = data[i].remindAt - timeNowMili;
      const a = time + 1 * 1000 * 60;
      const b = time + 1.25 * 1000 * 60;
      const c = time + 1.5 * 1000 * 60;
      const d = time + 1.75 * 1000 * 60;
      const f = time + 2 * 1000 * 60;

      console.log(time, a, b, c, d);
      // promises.push()
      setTimeout(()=>{preSendNotification(data[i])}, time);
      setTimeout(()=>{preSendNotification(data[i])}, a);
      setTimeout(()=>{preSendNotification(data[i])}, b);
      setTimeout(()=>{preSendNotification(data[i])}, c);
      setTimeout(()=>{preSendNotification(data[i])}, d);
      setTimeout(()=>{preSendNotification(data[i])}, f);
      if(data[i].boolPatch){
        const e = time + 1000 * 60 * 60 * data[i].patchLength;
        setTimeout(()=>{reminderNotification(data[i])}, e);
      }
    }
  })
});

function reminderNotification(data){

  sendNotification(data, "Your Patching Time Is Over").then( (data)=> {
    console.log(data, "hooray sent");
    // resolve("sent!");
  })
  .catch( (e)=> {
    console.log(e, "oh no something is wrong");
    // reject(e);
  })
}

function preSendNotification(data){
  const d = new Date().getTime();
  console.log("activated presend", d);

  // return new Promise ((resolve, reject) => {
    reminderModel.findOne({remindAt: data.remindAt, token: data.token}).then( (confData)=>{
      if(confData.taken){
        return;
      }

      const msg = (data.boolPatch) ? ("Time to patch") : ("Time to take your drops");
      sendNotification(data, msg).then( (data)=> {
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

  //find a way to get new reminders into the firing range if they missed the hourly check
  if(Object.keys(req.body).length != 5){
    // console.log(req.body.length, "not big enough");
    return res.status(400).json({msg: "bad request!"});
  }

  let body = {};
  console.log(req.body.id.value);
  if(req.body.boolPatch.value){
    body = {
      token: req.body.token.value,
      remindAt: req.body.remindAt.value,
      boolPatch: req.body.boolPatch.value,
      patchLength: req.body.patchLength.value,
      taken: false,
      id: req.body.id.value
    }
  }else{
    body = {
      token: req.body.token.value,
      remindAt: req.body.remindAt.value,
      boolPatch: req.body.boolPatch.value,
      taken: false,
      id: req.body.id.value
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
  let tokenId = req.params.tokenId;
  if(tokenId == null){
    return res.status(400).json({msg: 'bad request'})
  }else{
    let tdate = new Date();
    let a = tdate.getTime();
    //>later we'll create a function to grab all the data, for now it's only forward looking
    reminderModel.find({token: tokenId, remindAt: {$gte: a - (1000 * 60 * 7)}, taken: false }).sort({remindAt: 1}).then( (data) => {
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

function sendNotification(obj, msg){

  return new Promise((resolve, reject)=> {
    if(!isValidToken(obj.token)){
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

exports.sendFullRecordsEJS = (req, res) => {

  const tokenId = req.params.tokenId;
  let timeNowMili = new Date().getTime();

  reminderModel.find({ token: tokenId, remindAt: {$lt: timeNowMili} } ).then( (data)=> {
    return res.status(200).render("eyeRememberTable", {data} );
  })


}

exports.sendFullRecordsJSON = (req, res) => {
  const tokenId = req.params.tokenId;
  let timeNowMili = new Date().getTime();

  reminderModel.find({ token: tokenId, remindAt: {$gt: timeNowMili} } ).then( (data)=> {
    return res.status(200).json({erMsg: false, data});
  })
  .catch(e => {
    return res.status(400).json({erMsg: true, e})
  })
}

exports.deleteAlarm = (req, res) => {

  let timeNowMili = new Date().getTime();

  reminderModel.remove( {token: req.body.token.value, id: req.body.id.value, remindAt: {$gt: timeNowMili} } ).then( () => {
    reminderModel.find( {token: req.body.token.value, id: req.body.id.value, remindAt: {$gt: timeNowMili} } ).then( (data) => {
      if(data == null){
          return res.status(205).json({erMsg: false, msg: "finished"});
      }else{
          return res.status(400).json({erMsg: true, msg: "error deleting item", data});
      }
    })
  })

}
