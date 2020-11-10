const projectPath = require("../config/projectPath.json");
const blogPath = require("../config/blogPath.json");
const mediaPath = require("../config/mediaPath.json");

exports.indexPage = function(req, res){
  res.status(200).render('index');
}

exports.speedTest = (req, res) => {
  //timezone is east coast
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let seconds = date.getSeconds();
  return res.status(200).json({hour, minute, seconds, date});
}

exports.projectPage = (req, res) => {
    res.status(200).render('projects');
}

exports.projectSpecific = (req, res) => {
  let a = req.params.project;
  for(let i = 0; i < projectPath.length; i++){
    let test = projectPath[i].substring(0, projectPath[i].indexOf('.'));
    if(a === test){
      return res.status(200).render('projects/'+a);
    }
    if(i == projectPath.length - 1){
      return res.status(200).redirect('/projects');
    }
  }
}

exports.blogPage = (req, res) => {
  res.status(200).render('blog');
}

exports.blogSpecific = (req, res) => {

  let a = req.params.num;
  for(let i = 0; i <= blogPath.length; i++){
    let test = blogPath[i].substring(0, blogPath[i].indexOf('.'));
    if(a === test){
      return res.status(200).render('blogs/'+a);
    }
    if(i == blogPath.length - 1){
	console.log("ENDED", a, test);
      return res.status(200).redirect('/blog');
    }
  }
}

exports.mediaSpecific = (req, res) => {
  console.log("Reached");
  let a = req.params.num;
  for(let i = 0; i < mediaPath.length; i++){
    let test = mediaPath[i].substring(0, mediaPath[i].indexOf('.'));
    if(a === test){
      return res.status(200).render('media/'+a);
      break;
    }
    if(i == mediaPath.length - 1){
      return res.status(200).render('media/1');
      break;
    }
  }
}

exports.mediaPage = (req, res) => {
  return res.status(200).redirect('/media/'+mediaPath.length);
}
