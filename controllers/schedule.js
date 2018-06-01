const hwModel = require("../models/hwSchema.js");
const eventModel = require("../models/eventSchema.js");
const subjectModel = require("../models/subjectSchema.js");

const config = require("../config.json");

exports.getSchedule = function(req, res){
  var dataObj = {};
  var whole = new Date();
  var year = whole.getFullYear();
  var month = whole.getMonth()+1;
  var date = whole.getDate();
  var day = whole.getDay();

  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  dataObj.daysInMonth = daysInMonth[month - 1];

  dataObj.year = year;
  dataObj.showDays = config.days;
  dataObj.month = month;
  dataObj.date = date;

  dataObj.weekOf = weekOf(day, month, date);

  dataObj.dayOfWeek = day;



  subjectModel.find({}).then(function(data){

    dataObj.subjects = data;

    //still don't understand why date-1 is needed to catch the current date
    hwModel.find({monthDue: month, dayDue: {$gt: date-1, $lt: date+dataObj.showDays }}).then(function(hwData){

      dataObj.hw = hwData;
      var entries = [];
      //is this how we account for days?

      for(var subject = 0; subject < data.length; subject++){
        entries[subject] = [];

        for(var assignment = 0; assignment < hwData.length; assignment++){
          //how to handle day

          //how to account for empty days
          //now we need to make it so the empty date subjects are empty
          if(hwData[assignment].subject == data[subject].subject){
            entries[subject][assignment] =  hwData[assignment];
          }else{
            entries[subject][assignment] = {
              subject: 'blank',
              assignmentName: 'blank',
              monthDue: 0,
              dayDue: 0,
              yearDue: 0,
              assignmentDescription: null
                                            }
          }
        }

    }

      //data is now sorted by subject
      //subjects are the first []
      //assignment is the second []
      dataObj.entries = entries;

      //there is some unfulfilled promise here, that is throwing off the redirect, but fine on reload

      eventModel.find({month: month, day: {$gt: date-1, $lt: date+dataObj.showDays }}).then(function(eventData){
        dataObj.events = eventData;
        //console.log("***",dataObj.entries, "is data being successfully passed?\n");

        res.status(201).render("scheduleHome", dataObj);

      })


    })

  })
  //find out what is the date of Sunday
}

function weekOf(day, month, date){
  if(day == 0){
    var a = month+"/"+date;
    return a;
  }else{
    if(date - day >0){
      var novaDate = date - day;
      var a = month+"/"+novaDate;
      return a;
    }else{
      month -=1;
      var novaDate = 30+(date-day);
      var a = month+"/"+novaDate;
      return a;
      //more stuff needed
    }
  }
}

exports.postItem = function(req, res){
  console.log("posted something");
}

exports.newSubject = function(req, res){
  new subjectModel({
    subject: req.body.subjectNew
  }).save().then(function(data){
    console.log("successfully saved subject",data);
    res.redirect("/");
  })
}

exports.newHW = function(req, res){
  new hwModel({
    subject: req.body.subject,
    assignmentName: req.body.assignmentName,
    monthDue: req.body.monthDue,
    dayDue: req.body.dayDue,
    yearDue: req.body.yearDue,
    assignmentDescription: req.body.assignmentDescription,
    isCompleted: false,
    isHandedIn: false,
  }).save().then(function(data){
    console.log("successfully saved homework", data);
    res.redirect("/");
  })
}

exports.newEvent = function(req, res){

  console.log("run");

  new eventModel({
  eventName: req.body.eventName,
  month: req.body.month,
  day: req.body.day,
  year: req.body.year,
  eventDescription: req.body.assignmentDescription,
  repeats: req.body.repeat
}).save().then(function(data){
  console.log("successfully saved event",data);
  res.redirect("/");
});
}

exports.completeHW = function(req, res){

  hwModel.findOneAndUpdate({
    subject: req.body.subject,
    assignmentName: req.body.assignmentName,
    dayDue: req.body.dayDue,
  },{
    isCompleted: true
  }).then(function(){
    console.log("the event", req.body.assignmentName, " was completed");
    res.redirect("/");
  })
}

exports.deleteHW = function(req, res){

  hwModel.findOneAndUpdate({
    subject: req.body.subject,
    assignmentName: req.body.assignmentName,
    dayDue: req.body.dayDue,
  },{
      isCancelled: true
  }).then(function(){
    console.log("the event", req.body.assignmentName, " was cancelled");
    res.redirect("/");
  })
}
