var path = require('path');
const hwModel = require("../models/hwSchema.js");
const eventModel = require("../models/eventSchema.js");
const subjectModel = require("../models/subjectSchema.js");
const budgetItemModel = require("../models/budgetItemSchema.js");

exports.landing = (req, res) => {
  console.log("welcome back, sir", req.user);

  res.sendFile(path.resolve("public/home.html"));
}

exports.userInfo = (req, res) =>{
  return res.status(200).json({user: req.user.matthew});
}

exports.getCalendarInfo = async (req, res) => {

  var whole = new Date();

  const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    //getting info for next 3 days

    //we'll cover specific dates later, maybe in different function?
    var year = whole.getFullYear();
    var month = whole.getMonth()+1;
    var date = whole.getDate();
    var numberWeekDay = whole.getDay();
    var day = daysInWeek[numberWeekDay];
    console.log('reached');

    await subjectModel.find({}).then(function(data){
      //grab all subjects then
      hwModel.find({monthDue: month, dayDue: {$gt: date-1, $lt: date+2 }}).then(function(hwData){
        return res.status(200).json({subjects: data, hwData: hwData, date: [year, month, date, day]})
      })
    })

}

exports.postNewSubject = async (req, res)=>{

  console.log("where my homies at?", req.body);
  const {
    subject
  } = req.body;

  const newEntry = new subjectModel({
    subject: subject
  })

  try{
    return res.status(201).json({error: false, data: await newEntry.save()})
  }catch(e){
    return res.status(400).json({error: true, msg: "Something has gone wrong while saving the document"})
  }


}

exports.postDeleteSubject = async (req, res)=>{
  console.log('reached');
  const{
    subject
  } =  req.body

  try{
    return res.status(204).json({error: false, data: await subjectModel.findOneAndDelete({_id: subject})})
  }catch (e){
    return res.status(400).json({error: true, msg: "failure to delete subject"})
  }
}
