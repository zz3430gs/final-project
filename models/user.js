var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//The Schema for users
var userSchema = new mongoose.Schema({
    local: {
        username: String,
        password: String
    },
    profile:{
        name: String,
        about: String,
        email: String,
        education: String,
        job: String

    }

});

userSchema.methods.generateHash = function(password){
    //Create salted has of plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function (password) {
    //Compare password to stored password
    return bcrypt.compareSync(password, this.local.password);
};

User = mongoose.model('User', userSchema);

module.exports = User;