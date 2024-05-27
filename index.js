const express = require("express");
const app = express();

const path = require('path');
const compression = require('compression');
const morgan=require('morgan')
const helmet=require("helmet")
const multer=require("multer")
const cors = require("cors");
const mongoose=require("mongoose")
const { checkSchema } = require("express-validator");
const userController = require("./app/controllers/userController");
const userRegisterValidationSchema=require("./app/validation/user-register-validation")
const userLoginValidationSchema=require("./app/validation/user-login-validation");
const userProfileValidation=require("./app/validation/user-profile-validation")
const authenticateUser = require("./app/middlewares/authenticateUser");
const {postCreateValidationSchema,postUpdateValidationSchema} = require("./app/validation/post-validation");
const postController = require("./app/controllers/postController");
const commentController = require("./app/controllers/commentController");
const commentValidationSchema = require("./app/validation/comment-validation");
require("dotenv").config();
app.use(express.json());
app.use(helmet())

app.use(cors());

app.use(compression());

// Setup Morgan middleware
const log = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
});
app.use(log); // Apply the logger middleware

//db connection
const db=async () => {
    try {
        await mongoose.connect(process.env.database);
        console.log("connected to db");
    } catch (err) {
        console.log("db error");
    }
}
db()

//multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,"uploads/")

  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() 
    cb(null,uniqueSuffix+ file.originalname)
  }
})


const upload = multer({ storage: storage })

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log(__dirname)


app.post("/api/users/register",upload.single("profilePicture"),checkSchema(userRegisterValidationSchema),userController.register)
app.post("/api/users/login",checkSchema(userLoginValidationSchema),userController.login)
app.get('/api/users/profile',authenticateUser,userController.account)
app.put("/api/users/profile",upload.single("profilePicture"),authenticateUser,checkSchema(userProfileValidation),userController.editProfile)
app.post("/api/posts",upload.single("featuredImage"),authenticateUser,checkSchema(postCreateValidationSchema),postController.create)
app.get("/api/posts",postController.show)
app.get("/api/posts/:id",postController.some)
app.put("/api/posts/:id",authenticateUser,upload.single("featuredImage"),checkSchema(postUpdateValidationSchema),postController.edit)
app.delete("/api/posts/:id",authenticateUser,postController.delete)
app.get("/api/posts/myposts/:id",postController.myPosts)
app.post("/api/posts/:postId/comments",authenticateUser,checkSchema(commentValidationSchema),commentController.create)
app.get("/api/posts/:postId/comments",commentController.show)
app.put("/api/posts/:postId/comments/:commentId",authenticateUser,checkSchema(commentValidationSchema),commentController.update)
app.delete("/api/posts/:postId/comments/:commentId",authenticateUser,commentController.delete)
app.listen(process.env.port, () => {
    console.log("server running on port", process.env.port);
});
