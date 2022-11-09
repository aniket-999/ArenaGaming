const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require("../keys")
const requireLogin = require('../middleware/requireLogin')
const asyncHandler = require("express-async-handler");

router.get('/protected',requireLogin, (req, res) => {
    res.send("hello user")
})

router.post('/signup', (req, res) => {
    const {name, email, password, pic} = req.body
    console.log(req.body);
    if(!email || !password || !name) {
        return  res.status(422).json({error:"Please add all the fields"})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser) {
            return res.status(422).json({error:"User already exist with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
    
            user.save().then(user=>{
                res.json({message: "Saved successfully"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
    }).catch(err=> {
        console.log(err);
    })
})

router.post('/signin', (req, res)=> {
    const {email, password} = req.body
    if(!email || !password) {
        res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser) {
            return res.status(422).json({error:"Invalid Email or password"});   //Inorder to provide security to the user
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=> {
            if(doMatch) {
                // const ticket = req.headers.authorization.split(" ")[1];
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id, name, email, pic, followers, following} = savedUser
                res.json({token, user:{_id, name, email, pic, followers, following}})
            } else {
                return res.status(422).json({error:"Invalid Email or Password"})    //Inorder to provide seurity to the user 
                //Here we can write wrong password but will throw the above error because if any unknown person tries to enter the valid users account he/she should not get any hints
            }
        })
        .catch(err=> {
            console.log(err)
        })
    })
})

const allUsers = asyncHandler(async(req,res) => {
    const keyword = req.query.search? {
        $or: [
            {name: { $regex: req.query.serach, $options:"i"} },
            {email: { $regex: req.query.serach, $options:"i"} },
        ]
    }
    :{};

    const users = await (await User.find(keyword)).find({ _id: { $ne: req.user._id}});
    res.send(users);

})

router.route("/chat").get(requireLogin,allUsers);

module.exports = router