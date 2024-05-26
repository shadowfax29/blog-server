const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    profilePicture:String,
    username: String,
    email: String,
    password: String,
    bio: String,
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
