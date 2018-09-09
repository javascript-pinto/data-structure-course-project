var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.query.type != 'game') { // default to country view
        if (process.data.countries.length == 0) {
            var countriesFormated = []
        } else {
            let idx = parseInt(req.query.index)
            if (isNaN(idx)) {
                idx = 0
            } else if (idx > process.data.countries.length) {
                idx = process.data.countries.length - 1
            }
            var countriesFormated = process.data.formatSingleCountry(process.data.countries[idx])
        }
        res.render('query-country', {countries: countriesFormated})

    } else {  // games queries
        if (process.data.sports.length == 0) {
            var gamesFormated = []
        } else {
            let idx = parseInt(req.query.index)
            if (isNaN(idx)) {
                idx = 0
            } else if (idx > process.data.sports.length) {
                idx = process.data.sports.length - 1
            }
            var gamesFormated = process.data.formatSingleGame(process.data.sports[idx])
        }
        res.render('query-game', {games: gamesFormated})
    }
});

module.exports = router;
