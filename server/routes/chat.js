const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
// const Chat = mongoose.model("Chat")
const Chat = require("../models/chatModel")
const User = require('../models/user')
const { populate } = require('../models/user')
const Message = require("../models/messageModel")
const { latestMessage, groupAdmin, isGroupChat } = require("../models/chatModel")

//for accessing chat (accessChat)
router.post('/chat', requireLogin, async (req, res) => {
    const { userId } = req.body;
    if(!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400)
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $ans: [
            {users: {$elementMatch:{$eq:req.user._id }}},
            {users: {$elementMatch:{$eq: userId }}}
        ]
    }).populate("users", "-password")
        .populate(latestMessage);
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email",
    })

    if(isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).send(FullChat)

        } catch(err) {
            res.status(400)
            throw new Error(err.message);
        }
    }
})


//fetchChats
router.get('/chat', requireLogin, async (req, res) => {
    try {
        Chat.find({users:{$elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
            .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results);
        })
    } catch(err) {
        res.status(400)
        throw new Error(err.message);
    }
})


//group createGrouptChat 
router.post('/chat/group', requireLogin, async (req, res)=> {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users);
    if(users.length < 2) {
        return res.status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch(err) {
        res.status(400)
        throw new Error(err.message);
    }
});


//rename reanameGroup
router.put('/chat/rename', requireLogin, async (req, res)=> {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat Not found");
    } else {
        res.json(updatedChat);
    }
})

//groupadd addtoGroup
router.put('/chat/groupadd', requireLogin, async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId },  
    }, 
    { new: true }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!added) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(added);
    }
})

//groupremove removeFromGroup
router.put('/chat/groupremove', requireLogin, async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId },  
    }, 
    { new: true }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!removed) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.json(removed);
    }
})


module.exports = router