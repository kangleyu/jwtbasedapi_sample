var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../../config');
var User = require('../models/user');

// authenticate router
router.post('/authenticate', function(req, res){
  console.log(req.body.name);
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) {
      throw err;
    }

    if (!user) {
      res.json({ success: false, message: 'Authentication failed, user not found'});
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed, wrong password'});
      } else {
        var token = jwt.sign(user, config.secret, {
          expiresIn: '1h'
        });
        res.json({
          success: true,
          message: 'You got it!',
          token: token
        });
      }
    }
  });
});

// route middleware to verify a token
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(404).send({
      success: false,
      message: 'No token provided'
    })
  }
});

router.get('/', function(req, res) {
  res.json({ message: 'Welcome!' });
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

module.exports = router;