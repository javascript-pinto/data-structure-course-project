var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var summaryRouter = require('./routes/summary');
var createRouter = require('./routes/create');
var rankingRouter = require('./routes/ranking');
var queryRouter = require('./routes/query');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/pug-bootstrap'))); // for css

app.use('/', indexRouter);
app.use('/summary', summaryRouter);
app.use('/create', createRouter);
app.use('/ranking', rankingRouter);
app.use('/query', queryRouter);

// initialize data structure
class Sport {
  constructor(id, name, numAwards, gender) {
    this.id = id
    this.name = name
    this.numAwards = numAwards
    this.countries = []
    this.gender = gender
  }

  insert(country) {
    if (this.countries.length < this.numAwards) {
      this.countries.push(country) 
      country.award(this)
    }
  }

  clear() {
    this.countries = []
  }
}

class Country {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.awards = []
    this.manScore = 0
    this.womanScore = 0
    this.score = 0
  }

  award(sport) {
    this.awards.push(sport)
    this.updateStats()
  }

  updateStats() {
    this.manScore = scoreCountry(this, 'man')
    this.womanScore = scoreCountry(this, 'woman')
    this.score = this.manScore + this.womanScore
  }
}

process.data = {
  sports: [], 
  countries: [],
  numAwards: [5, 5, 3], // the first n winning countries gain scores
  scoreMap: {
    5: [7, 5, 3, 2, 1],
    3: [5, 3, 2]
  }
}

// initialize sports
initialSports = ['Archery', 'Boxing', 'Cycling BMX']
initialGenders = ['man', 'woman', 'woman']
numGames = initialSports.length // global variable

for (var i = 0; i < numGames; i++) { 
  process.data.sports.push(new Sport(i, initialSports[i], process.data.numAwards[i], initialGenders[i]))
}

// award countries
countryNames = [
  'Athens', 'Paris', 'United States', 'United Kingdom',
  'Sweden', 'Germany', 'Belgium', 'France'
]

numCountries = countryNames.length
for (let i = 0; i < countryNames.length; i++) {
  process.data.countries.push(new Country(i, countryNames[i]))
}

// populate sports with awarded countries
for (var sportIdx = 0; sportIdx < numGames; sportIdx++) {
  for (var countryIdx = 0; countryIdx < process.data.numAwards[sportIdx]; countryIdx++) {
    var awardCountry = process.data.countries[getRandomInt(numCountries)]
    process.data.sports[sportIdx].insert(awardCountry)
  }
}

// helper functions
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// formatting functions
function scoreCountry(country, gender) {
  let score = 0
  for (const sport of country.awards) {
    let steps = sport.countries.length
    for (let i = 0; i < steps; i++) {
      if (sport.countries[i].name == country.name && sport.gender == gender) {
        score += process.data.scoreMap[sport.numAwards][i]
      }
    }
  }
  return score
}

// format countries for table display
function formatCountryForTable(countries) {
  res = []
  for (country of countries) {
    res.push([
      country.id, country.name, country.score, 
      country.womanScore, country.manScore
    ])
  }
  return res
}
process.data.formatCountryForTable = formatCountryForTable

function sortCountryArrayBy(countries, crit) {
  // crit is one of Country's properties

  if (countries.length == 0) {
    return countries
  }
  // sort only if crit is valid
  if (crit in countries[0]) {
    countries.sort(function (a, b) {
      if (crit == 'name') {
        return b[crit] < a[crit]
      } else {
        return b[crit] > a[crit]  
      }
    })
  }
  return countries
}
process.data.sortCountryArrayBy = sortCountryArrayBy

function formatSingleCountry(country) {
  res = []
  for (const game of country.awards) {
    let thisScore = 0
    for (let i = 0; i < game.countries.length; i++) {
      if (game.countries[i].name == country.name) {
        thisScore += process.data.scoreMap[game.numAwards][i]
      }
    }
    res.push([
      country.id, country.name, country.score, 
      country.manScore, country.womanScore, 
      game.name, thisScore
    ])
  }
  return res
}
process.data.formatSingleCountry = formatSingleCountry

function formatSingleGame(game) {
  res = []
  for (const country of game.countries) {
    res.push([
      game.id, game.name, game.numAwards, 
      country.name, game.gender
    ])
  }
  return res
}
process.data.formatSingleGame = formatSingleGame

function formatSportsForTable(sports) {
  res = []
  for (const sport of sports) {
    countries = sports.countries.map(el => el.name)
    res.push([
      sport.name, countries, 
    ])
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
