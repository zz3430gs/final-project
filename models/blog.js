var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var blogSchema = new Schema({

});

var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;