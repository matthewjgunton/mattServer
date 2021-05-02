exports.indexPage = (req, res) => {
  if (req.user){
    return res.redirect("/paper/home");
  }
  return res.status(201).render("paper/index.ejs");
}

exports.homePage = (req, res) => {
  if(!req.user){
    return res.redirect("/paper/");
  }
  console.log("HOMEPAGE");
  return res.status(201).render("paper/home.ejs", {user: req.user});
}
