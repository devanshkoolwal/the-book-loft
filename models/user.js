var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role:{
        type:Number,
        default:0
    }
   });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);