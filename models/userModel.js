const mongoose = require("mongoose");
const Joi = require("joi");
const jwt=require("jsonwebtoken");
const {config} = require("../config/secret")


let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String, default: "regular"
    },
    date_created: {
        type: Date, default: Date.now()
    }
})
exports.UserModel = mongoose.model("users", userSchema);

exports.creatToken =(_userId)=>{
    let token=jwt.sign({_id:_userId},config.TokenSecret,{expiresIn:"60mins"});
    return token;
}

exports.validateUser = (_reqBody) => {
    let joiSchema =Joi.object({
        name:Joi.string().min(2).max(99).required(),
        email:Joi.string().min(4).max(99).email().required(),
        password:Joi.string().min(3).max(99).required(),
    })
    return joiSchema.validate(_reqBody);
}

exports.validateLogin =(_reqBody) =>{
    let joiSchema=Joi.object({
        email:Joi.string().min(4).max(99).email().required(),
        password:Joi.string().min(3).max(99).required(),
    })
    return joiSchema.validate(_reqBody);
}

