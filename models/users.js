const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

// Add Passport-Local Mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Define and export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
