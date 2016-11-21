// get the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var User = require('./app/models/user');

// configuration
var port = process.env.PORT || 8080;
mongoose.connect(config.database);

// use body parser so we can get info from POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// routes
app.get('/', function(req, res){
  res.send('Hello from api http://localhost:' + port + '/api');
});

// setup routes
app.get('/setup', function(req, res) {
  var tom = new User({
    name: 'Tom Yu',
    password: 'password',
    admin: true
  });

  tom.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// api routes
app.use('/api', require('./app/routes/api'));

// start the server
app.listen(port);
console.log('App is listenning on port ' + port);