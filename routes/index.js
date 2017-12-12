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

/*GET the secret site if the user is logged in*/
router.get('/secret', isLoggedIn, function (req, res, next) {
    res.render('secret', {username: req.user.local.username, profile: req.user.profile})
});

/*GET logout to logout of site*/
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

/*POST to creating blog*/
router.post('/blogcreate', isLoggedIn, function (req, res, next) {
    res.render("createBlog")
});

/*POST to add a new blog to the database and save it*/
router.post('/addblog', isLoggedIn, function(req, res, next) {
    if (!req.body || !req.body.blogText){
        //no blog text info, ignore and redirect to home page
        req.flash('error', 'please enter a blog');
        res.redirect('/secret');
    }
    else{
        //Insert into database.
        //Create a new Blog, an instance of the Blog schema, and call save()

        new Blog({title: req.body.title, text: req.body.blogText, image: req.body.pic.toString(), dateCreated: new Date()}).save()
            .then((newBlog)=> {
                    console.log('The new blog created is: ', newBlog);
                    res.redirect('/secret');
                })
            .catch((err) => {
                next(err); //most likely to be a database error
            });
    }

});

/*GET a blog site*/
router.get('/blog/:_id', isLoggedIn, function (req, res, next) {

    //get the information of a blog
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

/* POST to delete any blog */
router.post('/delete', isLoggedIn, function(req, res, next){

    //delete a blog by id
    Blog.deleteOne({_id : req.body._id})
        .then((result)=>{
            if(result.deletedCount === 1) {
                res.redirect('/')
            }
        })
        .catch((err) => {
            next(err);
        });
});

/*POST to the blogpage*/
//blogpage have all the blogs that were added to database and show it
router.post('/blogpage', isLoggedIn, function (req, res, next) {
    Blog.find().select({title: 1, text: 1}).sort({title: 1})
        .then((docs)=>{
            console.log(docs);
            res.render('blogPage', { blogs: docs});
        })
        .catch((err)=>{
            next(err);
        });
});

router.post('/updateProfile', isLoggedIn, function(req, res, next){
    res.render("profile")

});

router.post('/saveSecrets' ,isLoggedIn, function (req, res, next) {
    // Check if the user has provided any new data
    if (!req.body.education && !req.body.name && !req.body.job) {
        req.flash('updateMsg', 'Please enter some new data');
        return res.redirect('/secret')
    }

    //Collect any updated data from req.body, and add to req.user

    if (req.body.name) {
        req.user.profile.name = req.body.name;
    }
    if (req.body.about) {
        req.user.profile.about = req.body.about;
    }
    if (req.body.name) {
        req.user.profile.email = req.body.email;
    }
    if (req.body.education) {
        req.user.profile.education = req.body.education;
    }
    if (req.body.job) {
        req.user.profile.job = req.body.job;
    }

    //And save the modified user, to save the new data.
    req.user.save(function(err) {
        if (err) {
            if (err.name == 'ValidationError') {
                req.flash('updateMsg', 'Error updating, check your data is valid');
            }
            else {
                return next(err);  // Some other DB error
            }
        }
        else {
            req.flash('updateMsg', 'Updated data');
        }

        //Redirect back to secret page, which will fetch and show the updated data.
        return res.redirect('/secret');
    })
});
module.exports = router;
