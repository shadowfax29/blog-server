const mongoose = require("mongoose")
const {Schema,model}=mongoose
const postSchema=new Schema({
    title:String,
    context:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    comments: [
        // {
        //   type: Schema.Types.ObjectId,
        //   ref: 'Comment',
        // }
      ],
      featuredImage: String,
      createdAt:String
       
      
      
},{timeStamps:true})
const Post=model("Post",postSchema)
module.exports=Post