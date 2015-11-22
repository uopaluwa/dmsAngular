var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./config');
var methodOverride = require('method-override');
var port = process.env.PORT || 8080;
var path = require('path');

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//exposing other routes
require('./app/routes/index.js')(app);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

// app.get('/', function(req, res) {
//     res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
exports = module.exports = app;
