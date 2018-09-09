var express = require('express');
var router = express.Router();


function renderPage (req, res, next) {
    let formated = process.data.formatSportsForTable(process.data.sports)
    res.render('create', {countries: formated})
}

/* GET users listing. */
router.post('/', function(req, res) {
    if (req.body.clear == 'yes') { // clear countries
        process.data.countries = []
        process.data.sports.forEach(element => {
            element.clear()
        })
        numCountries = 0
    } else if (req.body.addCountryName) { // add country
        if (!(req.body.addCountryName in countryNames)) {
            countryNames.push(req.body.addCountryName)
            process.data.countries.push(new process.data.Country(numCountries, req.body.addCountryName))
            numCountries++
        }
    } else { // award country
        if (process.data.countries.length != 0) {
            let sportId = parseInt(req.body.sportId)
            if (sportId > process.data.sports.length) {
                sportId = process.data.sports.length - 1
            }
            let countryId = parseInt(req.body.countryId)
            if (countryId > process.data.countries.length) {
                countryId = process.data.countries.length - 1
            }
            process.data.sports[sportId].insert(process.data.countries[countryId])   
        }
    }
    renderPage(req, res)
})

router.get('/', renderPage);

module.exports = router;
