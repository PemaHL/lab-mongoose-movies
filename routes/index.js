const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log("testing homepage");
  res.render("index");
});

module.exports = router;
