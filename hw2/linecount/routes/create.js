var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
    if (req.query.clear == 'yes') { // clear countries
        process.data.countries = []
        process.data.sports.forEach(element => {
            element.clear()
        })
        numCountries = 0
    } else if (req.query.addCountryName) { // add country
        if (!(req.query.addCountryName in countryNames)) {
            countryNames.push(req.query.addCountryName)
            process.data.countries.push(new Country(numCountries, req.query.addCountryName))
            numCountries++
        }
    } else { // award country
        let sportId = req.query.sportId
        if (sportId > process.data.sports.length) {
            sportId = process.data.sports.length - 1
        }
        let countryId = req.query.countryId
        if (countryId > process.data.countries.length) {
            countryId = process.data.countries.length - 1
        }

        process.data.sports[sportId].insert(process.data.countries[countryId])
    }

})

router.get('/', function(req, res, next) {
    let countriesFormated = process.data.formatCountryForTable(process.data.countries)
    res.render('create', {countries: countriesFormated})
    
});

module.exports = router;
