// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express     = require('express'); // Call Express
var app         = express(); // Define the app
var bodyParser  = require('body-parser'); // Get body-parser for POST reqs
var morgan      = require('morgan'); // Easily see requests
var mongoose    = require('mongoose'); // ODM for Mongo
var config      = require('./config.js');
var path        = require('path');

// APP CONFIGURATION ---------------------
// body-parser enables you to grab info from POST reqs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS reqs via middleware function
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

  next();
});

// Connect to Modulus.io DB
mongoose.connect(config.database);
// If wanting to do local:
// mongoose.connect(mongodb://localhost:27017/myDatabase)

// Log all requests to the console
app.use(morgan('dev'));

// Set location of static files
// Used for requests from the front-end
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API
// ======================================

// REGISTER OUR ROUTES ------------------
// All routes will be prefixed with /api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// CATCH-ALL ROUTE ----------------------
// ======================================
// Note: This needs to go after the other routes
// or none of the other routes will be able to be pinged
// This route sends it to the front-end
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
});

// START THE SERVER
// ======================================
app.listen(config.port);
console.log('Magic happens at port ' + config.port);