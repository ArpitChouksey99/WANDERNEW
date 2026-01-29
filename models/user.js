const mongoose = require("mongoose"); // ← ✅ correct
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    }  
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
