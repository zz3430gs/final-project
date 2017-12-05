var express = require('express');
var router = express.Router();
var passport = require('passport');
var Blog = require('../models/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
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
    Blog.find().select({title: 1, text: 1}).sort({title: 1})
        .then((docs)=>{
            console.log(docs);
            res.render('secret', {username: req.user.local.username});
        })
        .catch((err)=>{
            next(err);
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

router.post('/blogcreate', function (req, res, next) {
    res.render("createBlog")
});

router.post('/addblog', function (req, res, next) {
    if (!req.body || !req.body.blogText){
        //no blog text info, ignore and redirect to home page
        req.flash('error', 'please enter a blog');
        res.redirect('/secret');
    }
    else{
        //Insert into database.

        //Create a new Blog, an instance of the Blog schema, and call save()
        new Blog({title: req.body.title, text: req.body.blogText, dateCreated: new Date()}).save()
            .then((newBlog)=>{
                console.log('The new blog created is: ', newBlog);
                res.redirect('/secret');
            })
            .catch((err)=>{
                next(err); //most likely to be a database error
            });
    }

});

/*GET a blog site*/
router.get('/blog/:_id', function (req, res, next) {

    Blog.findOne({_id: req.params._id})
        .then((doc)=>{
            if(doc){
                res.render('blog', {blog: doc});
            }else{
                res.status(404);
                next(Error("blog not found"));
            }
        })
        .catch((err)=>{
            next(err);
        });
});


module.exports = router;
