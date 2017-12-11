var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//The schema for the blog
var blogSchema = new Schema({
    title: String,
    text: String,
    dateCreated: Date,
    image: String
    //comments: String

});

var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;