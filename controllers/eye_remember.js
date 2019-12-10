const fetch = require("node-fetch");
const reminderModel = require("../models/reminderModel");
const schedule = require('node-schedule');
const path = require("path");

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mgunton7@gmail.com',
    pass: 'udvyhnbrcmlpsqkf'
  }
});

const indexToDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
getHelp("MattServer online");

var rule = new schedule.RecurrenceRule();
rule.minute = 59;
const queue = [];
var grabData = schedule.scheduleJob(rule, function(){
  let whole = new Date();
  let day = whole.getDay();
  let hour = whole.getHours() + 1 * 60;
  let stringDay = indexToDay[day];
  reminderModel.find({days: [stringDay], time: hour, $where: "this.timesAsked != this.length"}).then((data)=>{
    for(let i = 0; i < data.length; i++){
      queue.push(data[i]);
    }
  })
});

var rule1 = new schedule.RecurrenceRule();
rule1.minute = 00;
var reminder1 = schedule.scheduleJob(rule1, async function(){
  let promises = [];
  //this works really well for drops, what about patches?
  queue.forEach((obj)=>{
        promises.push(sendNotification(obj));
  })
  await Promise.all(promises);

  queue.forEach((obj)=>{
    obj.timesAsked++;
    reminderModel.findByIdAndUpdate(obj.id, obj, {new: true}, (e, proof)=>{
      if(e){
        getHelp("updated reminder error"+e);
      }
    })
  })
});

var rule2 = new schedule.RecurrenceRule();
rule2.minute = 01;
var reminder2 = schedule.scheduleJob(rule2, async function(){
  let promises = [];
  //this works really well for drops, what about patches?
  queue.forEach((obj)=>{
        promises.push(sendNotification(obj));
  })
  await Promise.all(promises);
});

var rule3 = new schedule.RecurrenceRule();
rule3.minute = 02;
var reminder3 = schedule.scheduleJob(rule3, async function(){
  let promises = [];
  //this works really well for drops, what about patches?
  queue.forEach((obj)=>{
        promises.push(sendNotification(obj));
  })
  await Promise.all(promises);
});

function sendNotification(obj){

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
          body: msg,
          id: obj._id
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

exports.updateTaken = (req, res) => {

  //expecting id
  if(Object.keys(req.body).length != 1){
    return res.status(400).json({msg: "bad request!"});
  }
  //this may be inefficient, worth 2.0
  reminderModel.findById(req.body.id).then((data)=>{
    data.taken++;
    for(let i = 0; i < queue.length; i++){
      if(queue[i]._id == req.body.id){
        queue.splice(i,1);
      }
    }
    reminderModel.findByIdAndUpdate(data._id, data).then((res)=>{
      return res.status(201).json({msg: "successfully recorded"});
    }).catch( (e)=>{
        console.log("error updating reminder",e);
        getHelp("error updating reminder "+e);
        return res.status(500).json({msg: 'error', e});
      })
  }).catch( (e)=>{
      console.log("error finding reminder",e);
      getHelp("error finding reminder "+e);
      return res.status(500).json({msg: 'error', e});
    })

}

exports.create = (req, res) => {
  //this will have to be changed
    if(Object.keys(req.body).length != 5 && Object.keys(req.body).length != 6){
      return res.status(400).json({msg: "bad request!"});
    }
    let obj = req.body;
    let body;
    if(req.body.isDrops){
      body = {
        token: obj.token,
        isDrops: obj.isDrops,
        days: obj.days,
        length: obj.length,
        time: obj.time,
        timesAsked: 0,
        taken: 0
      }
    }else{
      body = {
        token: obj.token,
        isDrops: obj.isDrops,
        duration: obj.duration,
        days: obj.days,
        length: obj.length,
        time: obj.time,
        timesAsked: 0,
        taken: 0
      }
    }

    new reminderModel(body).save().then( (proof) => {
      console.log(proof, " we saved it");
      return res.status(201).json({msg: 'success! we saved '+proof.token})
    })
    .catch( (e)=>{
      console.log("error saving reminder",e);
      getHelp("error saving reminder "+e);
      return res.status(500).json({msg: 'error', e});
    })
}

exports.update = (req, res) => {

    if(Object.keys(req.body).length != 5 && Object.keys(req.body).length != 6){
      return res.status(400).json({msg: "bad request!"});
    }
    let obj = req.body;
    let body;
    if(req.body.isDrops){
      body = {
        isDrops: obj.isDrops,
        days: obj.days,
        length: obj.length,
        time: obj.time,
      }
    }else{
      body = {
        isDrops: obj.isDrops,
        duration: obj.duration,
        days: obj.days,
        length: obj.length,
        time: obj.time,
      }
    }
    console.log(body);
    reminderModel.findByIdAndUpdate(obj.id, body, {new: true}, (e, proof)=>{
      if(e){
        getHelp("updated reminder error"+e);
        console.log(e, "error updating");
        return res.status(500).json({msg: 'error', e});
      }
      console.log(proof, " <updated?");
      return res.status(201).json({msg: "succesfully updated "+proof._id})
    })
}

exports.read = (req, res) => {

    if(Object.keys(req.body).length != 1){
      return res.status(400).json({msg: "bad request!"});
    }

    let obj = req.body;
    if( !isValidToken(obj.token)){
      return res.status(400).json({msg: "bad request!"});
    }
    //we need to now remove all those that have already expired
    reminderModel.find({ token: obj.token, $where: "this.timesAsked != this.length" } ).then( (data)=> {
      return res.status(200).json({erMsg: false, data});
    })
    .catch(e => {
      getHelp("Getting records JSON error"+e);
      return res.status(400).json({erMsg: true, e})
    })
}

function getHelp(e){
  var mailOptions = {
    from: 'mgunton7@gmail.com',
    to: 'mgunton7@gmail.com',
    subject: 'EyeRemember Notification System Error',
    text: e
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
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

function dayToIndex (day) {
  switch(day){
    case "Sunday":
      return 0;
      case "Monday":
        return 1;
        case "Tuesday":
          return 2;
          case "Wednesday":
            return 3;
            case "Thursday":
              return 4;
              case "Friday":
                return 5;
                case "Saturday":
                  return 6;
                  default:
                    getHelp("Bad day");
  }

};
////////////////////////////////
//old
//
// var rule = new schedule.RecurrenceRule();
// rule.minute = 17;
//
// var j = schedule.scheduleJob(rule, function(){
//   //every hour
//   console.log('arrived at test');
//   let timeNowMili = new Date().getTime();
//   let hourPlus = timeNowMili + 1000 * 60 * 60;
//
//   reminderModel.find({remindAt: {$gt: timeNowMili, $lt: hourPlus} } ).sort({remindAt: 1}).then( (data)=> {
//     console.log("j'arive",data.length, timeNowMili+" patrol");
//     //here's our spinner
//     for(let i = 0; i < data.length; i++){
//       //we'll need to convert d into seconds, milisceonds is too big for setTimeout
//       const time = data[i].remindAt - timeNowMili;
//       const a = time + 1 * 1000 * 60;
//       const b = time + 1.5 * 1000 * 60;
//       const c = time + 2 * 1000 * 60;
//       const d = time + 2.5 * 1000 * 60;
//       const f = time + 3 * 1000 * 60;
//
//       console.log(time, a, b, c, d);
//       // promises.push()
//       setTimeout(()=>{preSendNotification(data[i])}, time);
//       setTimeout(()=>{preSendNotification(data[i])}, a);
//       setTimeout(()=>{preSendNotification(data[i])}, b);
//       setTimeout(()=>{preSendNotification(data[i])}, c);
//       setTimeout(()=>{preSendNotification(data[i])}, d);
//       setTimeout(()=>{preSendNotification(data[i])}, f);
//
//       console.log(data[i].boolPatch);
//       if(data[i].boolPatch){
//         const e = time + 1000 * 60 * 60 * data[i].patchLength;
//         console.log("patch ending reminder",e);
//         setTimeout(()=>{reminderNotification(data[i])}, e);
//       }
//     }
//   })
// });
//
// function reminderNotification(data){
//
//   sendNotification(data, "Your Patching Time Is Over").then( (data)=> {
//     console.log(data, "hooray sent");
//   })
//   .catch( (e)=> {
//     console.log(e, "oh no something is wrong");
//     getHelp("saying patching time is over error"+e);
//   })
// }
//
//
// function preSendNotification(data){
//   const d = new Date().getTime();
//   console.log("activated presend", d);
//
//   // return new Promise ((resolve, reject) => {
//     reminderModel.findOne({remindAt: data.remindAt, token: data.token}).then( (confData)=>{
//       if(confData.taken || confData == null){
//         return;
//       }
//
//       const msg = (data.boolPatch) ? ("Time to patch") : ("Time to take your drops");
//       sendNotification(data, msg).then( (data)=> {
//         console.log(data, "hooray sent");
//       })
//       .catch( (e)=> {
//         console.log(e, "oh no something is wrong");
//         getHelp("sending notification normal error"+e);
//       })
//     } )
//     .catch( (e) => {
//       getHelp(" error getting record"+e);
//     })
//   // });
// }
//
// exports.reminderReceived = (req, res) => {
//
//   //find a way to get new reminders into the firing range if they missed the hourly check
//   if(Object.keys(req.body).length != 5){
//     // console.log(req.body.length, "not big enough");
//     return res.status(400).json({msg: "bad request!"});
//   }
//
//   let body = {};
//   console.log(req.body.id.value);
//   if(req.body.boolPatch.value){
//     body = {
//       token: req.body.token.value,
//       remindAt: req.body.remindAt.value,
//       boolPatch: req.body.boolPatch.value,
//       patchLength: req.body.patchLength.value,
//       taken: false,
//       id: req.body.id.value
//     }
//   }else{
//     body = {
//       token: req.body.token.value,
//       remindAt: req.body.remindAt.value,
//       boolPatch: req.body.boolPatch.value,
//       taken: false,
//       id: req.body.id.value
//     }
//   }
//
//   new reminderModel(body).save().then( (proof) => {
//     console.log(proof, " we saved it");
//     //we need to check if we need to throw this thing into the cycle
//
//
//
//     return res.status(201).json({msg: 'success! we saved '+proof.token})
//   })
//   .catch( (e)=>{
//     console.log("error saving reminder",e);
//     getHelp("error saving reminder "+e);
//     return res.status(500).json({msg: 'error', e});
//   })
// }
//
// exports.tokenReceived = (req, res) => {
//   let tokenId = req.params.tokenId;
//   if(tokenId == null){
//     return res.status(400).json({msg: 'bad request'})
//   }else{
//     let tdate = new Date();
//     let a = tdate.getTime();
//     //>later we'll create a function to grab all the data, for now it's only forward looking
//     reminderModel.find({token: tokenId, remindAt: {$gte: a - (1000 * 60 * 7)}, taken: false }).sort({remindAt: 1}).then( (data) => {
//       return res.status(200).json({msg: 'data for user '+tokenId, data})
//     })
//     .catch( (e) => {
//       getHelp(e);
//       return res.status(500).json({error: true, msg: 'error getting '+tokenId+"'s data"})
//     })
//   }
// }
//
// exports.checkIfNew = (req, res) => {
//   if(Object.keys(req.body).length != 1){
//     // console.log(req.body.length, "not big enough");
//     return res.status(400).json({msg: "bad request!"});
//   }
//   let tokenId = req.body.value.token;
//   if(tokenId == null){
//     return res.status(400).json({msg: 'bad request'})
//   }else{
//     reminderModel.findOne({token: tokenId}).then( (data)=> {
//       if(data.length > 0){
//         return res.status(200).json({new: false});
//       }else{
//         return res.status(200).json({new: true});
//       }
//     })
//     .catch( (e)=> {
//       getHelp("Checking if new"+e);
//     })
//
//
//   }
// }
//
// exports.wasReminded = (req, res) => {
//   //give me the tokenId and the time
//   if(Object.keys(req.body).length != 2){
//     // console.log(req.body.length, "not big enough");
//     return res.status(400).json({msg: "bad request!"});
//   }
//   const tokenId = req.body.token.value;
//   const remindAt = req.body.remindAt.value;
//
//   reminderModel.findOneAndUpdate({token: tokenId, remindAt}, {taken: true})
//   .then( (data)=>{
//     console.log(data, "here is what we found with the tokenId and remindAt");
//     return res.status(201).json({msg: 'successfully checked off '+remindAt+" reminder", data})
//   })
//   .catch( (e) => {
//     getHelp("updated reminder error"+e);
//     console.log(e, "error updating");
//     return res.status(500).json({msg: 'error', e});
//   })
// }
//
// function isValidToken(token){
//   return (
//     typeof token === 'string' &&
//     (((token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[')) &&
//       token.endsWith(']')) ||
//       /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token))
//   );
// }
//
// function sendNotification(obj, msg){
//
//   return new Promise((resolve, reject)=> {
//     if(!isValidToken(obj.token)){
//       reject("invalid token");
//     }
//
//     const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
//
//     fetch(PUSH_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         to: obj.token,
//         sound: 'default',
//         title: 'Eye Remember',
//         body: msg,
//         data: {
//           body: msg
//         }
//       }),
//     })
//     .then(response => response.json())
//     .then( (data) => {
//       resolve(data);
//     }).catch( (e)=> {
//       reject(e);
//     })
//   })
// }
//
// exports.sendFullRecordsEJS = (req, res) => {
//
//   const tokenId = req.params.tokenId;
//   let timeNowMili = new Date().getTime();
//   console.log(timeNowMili);
//   reminderModel.find({ token: tokenId, remindAt: {$lt: timeNowMili} } ).then( (data)=> {
//     console.log('data', data);
//     return res.status(200).render("eyeRememberTable", {data} );
//   })
//
//
// }
//
// exports.sendFullRecordsJSON = (req, res) => {
//   const tokenId = req.params.tokenId;
//   let timeNowMili = new Date().getTime();
//
//   reminderModel.find({ token: tokenId, remindAt: {$gt: timeNowMili} } ).then( (data)=> {
//     return res.status(200).json({erMsg: false, data});
//   })
//   .catch(e => {
//     getHelp("Getting records JSON error"+e);
//     return res.status(400).json({erMsg: true, e})
//   })
// }
//
// exports.deleteAlarm = (req, res) => {
//
//   let timeNowMili = new Date().getTime();
//
//   reminderModel.remove( {token: req.body.token.value, id: req.body.id.value, remindAt: {$gt: timeNowMili} } ).then( () => {
//     reminderModel.find( {token: req.body.token.value, id: req.body.id.value, remindAt: {$gt: timeNowMili} } ).then( (data) => {
//       if(data == null){
//           return res.status(205).json({erMsg: false, msg: "finished"});
//       }else{
//           return res.status(400).json({erMsg: true, msg: "error deleting item", data});
//       }
//     })
//   })
//
// }
