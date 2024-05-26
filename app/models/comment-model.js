const mongoose=require("mongoose")
const User=require("./user-model")
const Post=require("./post-model")
const {Schema,model}=mongoose
const commentSchema=new Schema(
    {
        content:String,
        author:[
            {
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        post:{
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    },
    {timestamps:true}
)
const Comment=model("Comment",commentSchema)
module.exports=Comment