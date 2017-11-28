var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var blogSchema = new Schema({
    text: String,
    dateCreated: Date,
    comments: String

});

var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;