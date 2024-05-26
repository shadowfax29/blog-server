const mongoose = require("mongoose");
const Post = require("../models/post-model");

const postCreateValidationSchema = {
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Title is required",
    },
    notEmpty: {
      errorMessage: "Title should not be empty",
    },
    trim: true,
   
  },
  context: {
    in: ["body"],
    exists: {
      errorMessage: "Content is required",
    },
    notEmpty: {
      errorMessage: "Content should not be empty",
    },
    trim: true,
  },
  author: {
    in: ["body"],
    exists: {
      errorMessage: "Author is required",
    },
    notEmpty: {
      errorMessage: "Author should not be empty",
    },
   
  },
  
};
const postUpdateValidationSchema = {
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Title is required",
    },
    notEmpty: {
      errorMessage: "Title should not be empty",
    },
    trim: true,
   
  },
  context: {
    in: ["body"],
    exists: {
      errorMessage: "Content is required",
    },
    notEmpty: {
      errorMessage: "Content should not be empty",
    },
  },
  
  
};

module.exports = {postCreateValidationSchema,postUpdateValidationSchema};
