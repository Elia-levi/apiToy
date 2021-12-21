const express = require("express");
const bcrypt = require("bcrypt");
const { validateUser, UserModel, validateLogin, creatToken } = require("../models/userModel");
const {auth} = require("../middlewares/auth")
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.json({msg:"users work"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.post("/", async (req, res) => {
    let validBody = validateUser(req.body)
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "*********"
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system , try login" })
        }
        console.log(err);
        res.status(500).json(err);
    }
})

router.get("/login", async (req, res) => {
    try {
        res.json({msg:"login work"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.post("/login",async (req,res)=>{
    let validBody = validateLogin(req.body)
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try{
        let user =await UserModel.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({msg:"email or  Password is worng"});
        }
        let passValid = await bcrypt.compare(req.body.password,user.password);
        if(!passValid){
            return res.status(401).json({msg:"email or  Password is worng"});
        }
        let newToken = creatToken(user._id);
        res.json({token:newToken});
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;