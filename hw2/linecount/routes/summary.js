var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query)
  let countriesFormated = process.data.formatCountryForTable(process.data.countries)
  res.render('summary', {countries: countriesFormated})
});

module.exports = router;
