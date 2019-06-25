var path = require('path');

exports.landing = (req, res) => {
  console.log("welcome back, sir", req.user);

  res.sendFile(path.resolve("public/home.html"));
}
