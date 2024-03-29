const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
     name:{
         type:String,
         required:[true,"Please Enter Your Name"],
         maxlength:[30,"Name cannot exceed 30 characters"],
         minlength:[4,"Name should have more than 4 characters"],
     },
     email:{
         type:String,
         required:[true,"Please Enter Your Email"],
         unique:true,
         validate:[validator.isEmail,"Please Enter a valid email"]
     },
     password:{
         type:String,
         required:[true,"Please Enter Your Passowrd"],
         minlength:[8,"Password should be greater than 8 characters"],
        //  select meanings getfindallusers to not show users password
         select:false
     },
     avatar:{
         public_id:{
             type:String,
             required:true
         },
         url:{
             type:String,
             required:true
         }
     },
     role:{
         type:String,
         default:"user",
     },
     resetPasswordToken :String,
     resetPasswordExpire:Date
})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

// jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign(
        {id:this._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE,
        }
    )
}

// Compare password
userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password)
}

// genrate reset password
userSchema.methods.getResetPasswordToken = () => {

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex") 

    // hasing and adding resetpasswordtoken in schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken
}

module.exports = mongoose.model("users",userSchema)