

const commentValidationSchema={
    content:{
        in:["body"],
        exists:{
            errorMessage:"comment should not be missing"
        },
        notEmpty:{
            errorMessage:"comment should not be empty"
        }
    }
}
module.exports=commentValidationSchema