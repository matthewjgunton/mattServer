const path = require("path");
const fs = require('fs');

exports.createFiles= (pathway, name) => {

  return new Promise((resolve, reject)=> {
    fs.readdir(pathway, function(err, items) {

        fs.writeFile(path.join(__dirname+"/config/"+name+".json"), JSON.stringify(items), (err, file) => {
          if(err){
            //throw an err,this is bad!
            reject(err);
          }else{
            resolve('success!');
            console.log(name+' file created');
          }
        });
    });
  })
}
