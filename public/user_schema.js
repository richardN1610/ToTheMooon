const mongoose = require('mongoose');

//creating user model
const user = mongoose.Schema({
    fullname:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    mobile:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true
    }
})

module.exports = User = mongoose.model('User', user)    //exporting user model so it can be used in other files