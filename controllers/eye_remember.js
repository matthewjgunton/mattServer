const fetch = require("node-fetch");
const reminderModel = require("../models/reminderModel");
const schedule = require('node-schedule');
const path = require("path");
const extend = require('util')._extend
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mgunton7@gmail.com',
    pass: 'udvyhnbrcmlpsqkf'
  }
});

const indexToDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const timeToRemind = new Date().getMinutes()+1; //this is for debugging
const timeToRemind = -1;
getHelp("MattServer online");
const queue = [];
const patchQueue = [];
let hour = 0;

var rule = new schedule.RecurrenceRule();
rule.minute = 59;
var grabData = schedule.scheduleJob(rule, function(){
  let whole = new Date();
  let day = whole.getDay();
  hour = (whole.getHours() + 1) * 60;
  if(hour == 0){
    hour = 24*60;
  }
  let stringDay = indexToDay[day];
  console.log("grabbing data for "+indexToDay[day]+" at "+hour);
  reminderModel.find({days: {$all: [stringDay]}, time: hour, $where: "this.timesAsked < this.length"}).lean().then((data)=>{
    for(let i = 0; i < data.length; i++){
      queue.push(data[i]);
      data[i].timesAsked++;
      reminderModel.findByIdAndUpdate(data[i]._id, data[i], {new: true}, (e, proof)=>{
        if(e){
          getHelp("updated reminder error"+e);
        }
      })
    }
  })
});

var rule1 = new schedule.RecurrenceRule();
rule1.minute = timeToRemind+1;
var reminder1 = schedule.scheduleJob(rule1, async function(){
  let promises = [];
  //this works really well for drops, what about patches?
  console.log("sending out reminder 1:",queue);
  queue.forEach((obj)=>{
        promises.push(sendNotification(obj));
  })

  patchQueue.forEach((obj, i)=>{
    if(obj.time == hour){
      console.log("sending out patching reminder 1", patchQueue);
      promises.push(sendNotification(obj));
    }
    //check if we should remove from queue
    if(hour > obj.time){
      patchQueue.splice(i, 1);
    }
  })

  await Promise.all(promises);
});

var rule2 = new schedule.RecurrenceRule();
rule2.minute = timeToRemind+2;
var reminder2 = schedule.scheduleJob(rule2, async function(){
  let promises = [];
  console.log("sending out reminder 2:",queue);
  //this works really well for drops, what about patches?
  queue.forEach((obj)=>{
        promises.push(sendNotification(obj));
  })

  patchQueue.forEach((obj)=>{
    if(obj.time == hour){
      console.log("sending out patching reminder 2", patchQueue);
      promises.push(sendNotification(obj));
    }
  })

  await Promise.all(promises);
});

var rule3 = new schedule.RecurrenceRule();
rule3.minute = timeToRemind+3;
var reminder3 = schedule.scheduleJob(rule3, async function(){
  let promises = [];
  //this works really well for drops, what about patches?
  console.log("sending out reminder 3:",queue);
  queue.forEach((obj)=>{
        promises.push(sendNotification(obj));
  })

  patchQueue.forEach((obj)=>{
    if(obj.time == hour){
      console.log("sending out patching reminder 2", patchQueue);
      promises.push(sendNotification(obj));
    }
  })

  await Promise.all(promises);
});

var rule4 = new schedule.RecurrenceRule();
let window = 1;
rule4.minute = timeToRemind+4+window;//window is how long until you are no longer able to take it
var reminder3 = schedule.scheduleJob(rule4, async function(){
  console.log("clearing queue ",hour);
  queue.length = 0;
});

function sendNotification(obj){

  return new Promise((resolve, reject)=> {
    if(!isValidToken(obj.token)){
      reject("invalid token");
    }

    const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
    let msg = (obj.isDrops) ? ("Remember to Take Your Drops") : ("Remember to Patch");

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
        body: msg
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

exports.updateRemoveFromPatchQueue = (req, res) => {
  if(Object.keys(req.body).length != 1){
    return res.status(400).json({msg: "bad request!"});
  }

  for(let i = 0; i < patchQueue.length; i++){
    if(patchQueue[i].id == req.body.id){
      patchQueue.splice(i,1);
    }
  }
  return res.status(202).json({msg: "successfully recorded"});

}

exports.updateTaken = (req, res) => {

  //expecting id
  if(Object.keys(req.body).length != 1){
    return res.status(400).json({msg: "bad request!"});
  }
  reminderModel.findById(req.body.id).then((data)=>{
      data.taken++;
      for(let i = 0; i < queue.length; i++){
        if(queue[i]._id == req.body.id){
          if(!queue[i].isDrops){
              let obj = extend({}, queue[i]);
              obj.time = queue[i].time + 60 * queue[i].duration;
              patchQueue.push(obj);
          }
          queue.splice(i,1);
        }
      }
      reminderModel.findByIdAndUpdate(data._id, data).then((result)=>{
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
        length: (obj.length * obj.days.length),
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
        length: (obj.length * obj.days.length),
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

exports.delete = (req, res) => {
  //expecting id
  if(Object.keys(req.body).length != 1){
    return res.status(400).json({msg: "bad request!"});
  }

  reminderModel.findByIdAndDelete(req.body.id).then((data)=>{
    return res.status(202).json({data});
  })
  .catch(e=>{
    getHelp("deleting error "+e);
    console.log(e, "error deleting");
    return res.status(500).json({msg: 'error', e});
  });
}

exports.readAlarm = (req, res) => {
  //expecting a tokenId
  if(Object.keys(req.body).length != 1){
    return res.status(400).json({msg: "bad request!"});
  }

  let obj = req.body;
  if( !isValidToken(obj.token)){
    return res.status(400).json({msg: "bad request!"});
  }

  console.log("QUEUE:",queue);
  console.log("PATCHQUEUE:",patchQueue);
  console.log();

  let alarm = false;
  for(let i = 0; i < queue.length; i++){
    if(queue[i].token == obj.token){
      alarm = queue[i];
    }
  }
  //we're only letting one alarm go at a time
  let patchReminder = false;
  if(!alarm){
    for(let i = 0; i < patchQueue.length; i++){
      //how do we make sure this only happens for the right hour?
      if(patchQueue[i].token == obj.token && patchQueue[i].time == hour){
        alarm = patchQueue[i];
        patchReminder = true;
      }
    }
  }
  return res.status(200).json({data: {alarm: alarm, patchReminder: patchReminder}});
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

exports.readRecords = (req, res) => {
  if(Object.keys(req.body).length != 1){
    return res.status(400).json({msg: "bad request!"});
  }

  let obj = req.body;
  if( !isValidToken(obj.token)){
    return res.status(400).json({msg: "bad request!"});
  }
  reminderModel.find({ token: obj.token, $where: "this.timesAsked != 0" } ).then( (data)=> {
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
