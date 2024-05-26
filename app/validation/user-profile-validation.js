const userProfileValidation={
    profilePicture: {
        in: ["body"],
        exists: {
          errorMessage: "picture is required",
        },
        notEmpty: {
          errorMessage: "picture should not be empty",
        },
      },
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