const User = require("../models/user-model");

const userRegisterValidationSchema = {
   
  username: {
    in: ["body"],
    exists: {
      errorMessage: "username is required",
    },
    notEmpty: {
      errorMessage: "username should not be empty",
    },
    trim: true,
  },
  email: {
    in: ["body"],
    exists: {
      errorMessage: " email is required",
    },
    notEmpty: {
      errorMessage: "email should not be empty",
    },
    isEmail: {
      errorMessage: "email should be valid format",
    },
    trim: true,
    normalizeEmail: true,
    custom: {
      options: async function (value) {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email is already taken");
        } else {
          return true;
        }
      },
    },
  },
  password: {
    in: ["body"],
    exists: {
      errorMessage: "password is required",
    },
    notEmpty: {
      errorMessage: "password should not be empty",
    },
    isLength: {
      options: {
        min: 8,
        max: 128,
      },
      errorMessage: "password length should be 8 - 128 character length",
    },
    trim: true,
  },
  bio:{
    in: ["body"],
    notEmpty: {
        errorMessage:"bio should not be empty"
  },
  exists: {
    errorMessage: "password is required",
  }

}
}

module.exports = userRegisterValidationSchema;
