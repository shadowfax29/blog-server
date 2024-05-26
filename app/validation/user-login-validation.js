

const userLoginValidationSchema={
    email:{
        in:["body"],
        exists:{
            errorMessage:"emaiil should be present"
        },
        notEmpty:{
            errorMessage:"email should not be empty"
        }
    },
    password:{
        in:["body"],
        exists:{
            errorMessage:"password should be present"
    },  
    notEmpty:{
        errorMessage:"password should not be empty"
    }
}
}
module.exports=userLoginValidationSchema