const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
  username: {type: String, require: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false},
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
