var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "Express"});
  //   res.redirect('secret');
});

/*GET login page*/
router.get('/login', function (req, res, next) {
    res.render('login');
});

/*GET the signup page*/
router.get('/signup', function (req, res, next) {
    res.render('signup')
});

module.exports = router;
