const User = require("../models/user-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2
const { validationResult } = require("express-validator");
cloudinary.config({
    cloud_name: "de2pwnypg",
    api_key: "921886855567712",
    api_secret: "yfaOMHf3nhDCjeo-_QMTiFFym-E"
  });
const userController = {};

userController.register = async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  
    
    try {
        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(req.body.password, salt);
        const result = await cloudinary.uploader.upload(req.file.path);
       
        
       const newUser = new User({
          ...req.body,
           password: hashPassword,
           profilePicture:result.secure_url
       });
       
       const user = await newUser.save(); // Use.save() instead of.create() since we're modifying the schema
       res.status(201).send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "something went wrong" });
    }
};

userController.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const validPassword = await bcryptjs.compare(req.body.password, user.password);
            if (validPassword) {
                const tokenData = {
                    userId: user._id
                };
               
                const token = jwt.sign(tokenData, process.env.SECRET, { expiresIn: "7d" });
              return  res.json({ token: token });
            } else {
                return res.status(400).json({ error: "Invalid email/password" });
            }
        } else {
           return res.status(400).json({ error: "Invalid email/password" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "something went wrong" });
    }
};
userController.account= async(req,res)=>{
   try{
    
    const user=await User.findById(req.user.id)
    res.json(user)
  
   } 
   catch(err){

    res.json(err)
   }
}
userController.editProfile=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    try{
        const result = await cloudinary.uploader.upload(req.file.path);
       
        
       const newUser = {
          ...req.body,
           profilePicture:result.secure_url
       };
        const user=await User.findByIdAndUpdate({_id:req.user.id},newUser,{new:true})
return res.json(user)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"something went wrong"})
    }
}
module.exports = userController;
