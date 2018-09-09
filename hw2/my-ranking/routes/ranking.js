var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let countriesFormated = process.data.sortCountryArrayBy(process.data.countries, req.query.sortBy)
  countriesFormated = process.data.formatCountryForTable(countriesFormated)
  res.render('ranking', {countries: countriesFormated})
});

module.exports = router;
