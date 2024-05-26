const Post = require("../models/post-model")
const User = require("../models/user-model")
const cloudinary = require('cloudinary').v2
const { validationResult } = require("express-validator");
const postController = {}
cloudinary.config({
    cloud_name: "de2pwnypg",
    api_key: "921886855567712",
    api_secret: "yfaOMHf3nhDCjeo-_QMTiFFym-E"
  });
postController.create = async (req, res) => {
   
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body=req.body
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        
      const author=req.user.id
        let { title, context ,featuredImage} = body;
        if (req.file) {
            featuredImage = result.secure_url; // This will be the path where the file is saved
        }
        
        const post = new Post({
            title,
            context,
            featuredImage,
            author,
            createdAt:new Date()
        });

        await post.save();
        res.status(200).json(post);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}

postController.show = async (req, res) => {
   
    try {
     
        const post = await Post.find().populate('author')
        res.json(post)
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

postController.some=async(req,res)=>{
    try{

        const post=await Post.findById({_id:req.params.id}).populate("author")
        console.log("Post document:", post)
        res.json(post)
    }
    catch(err){
        res.status(500).json({error:err})
    }
}

postController.edit=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const result = await cloudinary.uploader.upload(req.file.path);
       const updatepost={
        ...req.body,
        featuredImage:result.secure_url,
       }
        
        const post=await Post.findByIdAndUpdate({_id:req.params.id},updatepost,{new:true})
        res.json(post)
    }
    catch(err){
        res.status(500).json({error:err})
    }
}

postController.delete=async(req,res)=>{
    try{
        const deletedpost=await Post.findByIdAndDelete({_id:req.params.id})
        res.json(deletedpost)
}
catch(err){
    res.status(500).json({error:err})
}
}

postController.myPosts = async (req, res) => {
    try {
      const myposts = await Post.find({ author: req.params.id }).populate('author')
      res.json(myposts);
    } catch (err) {
      console.log("Error fetching user's posts:", err); // Log any errors
      res.status(500).json({ error: err.message });
    }
  };
 
  
module.exports = postController