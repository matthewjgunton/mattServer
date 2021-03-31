const mongoose = require("mongoose");

const mongoUrl = "mongodb://localhost:27017/mPresent";

exports.run = () => {
  retry();
};

function retry(){
  return mongoose.connect(mongoUrl, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(retry, 5000);
    }else{
      console.log("connected to db");
    }
  });
}
