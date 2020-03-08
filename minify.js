const path = require("path");
const fs = require('fs');

let css = path.join(__dirname+'/public/css');
let html = path.join(__dirname+'/views');
let js = path.join(__dirname+'/public/vanillaJS');

try{
  minify(css);
  minify(html);
  minify(js);
}
catch(e){
  console.log(e);
}

function minify (pathway) {

  return new Promise((resolve, reject)=> {
    fs.readdir(pathway, function(err, items) {

      if(err){
        reject('error reading file directory', err);
      }

      for(let i = 0; i < items.length; i++){
        if (items[i].includes(".")){

          fs.readFile(pathway+"/"+items[i], 'utf8', function(err, contents) {

            if(err){
              reject("error reading file", err);
            }

            let newContent = contents;
            newContent = newContent.replace(/\r?\n|\r/g, '');
            newContent = newContent.replace(/\s\s+/g, ' ');

            fs.writeFile(pathway+"/"+items[i], newContent, function(err) {
              if(err) {
                reject("error writing file",err);
              }
              console.log(items[i]+" was minified");
              resolve(true);
            });
          });
        }else{
          minify(pathway+"/"+items[i]);
        }
      }
    });
  })
}
