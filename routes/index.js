var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', {title: "Express"});
    res.redirect('secret');
});

/*GET login page*/
router.get('/login', function (req, res, next) {
    res.render('login');
});

/*GET the signup page*/
router.get('/signup', function (req, res, next) {
    res.render('signup')
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/secret',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/secret',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/secret', isLoggedIn, function (req, res, next) {

    res.render('secret', {
        username: req.user.local.username,

    });
});
router.get('/logout', function(req, res, next) {
    //passport middleware adds logout function to req object
    req.logout();
    res.redirect('/'); //redirect to home page
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        next();
    }else {
        res.redirect('/login');
    }
}
module.exports = router;
