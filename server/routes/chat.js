const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
// const Chat = mongoose.model("Chat")
const Chat = require("../models/chatModel")
const User = require('../models/user')
const { populate } = require('../models/user')
const Message = require("../models/messageModel")
const { latestMessage } = require("../models/chatModel")

//for accessing chat (accessChat)
router.post('/chat', requireLogin, async (req, res) => {
    const { userId } = req.body;
    if(!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400)
    }
    var isChat = await Chat.find({
        isGoupChat: false,
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
router.get('/chat', requireLogin, (req, res) => {

})


//group createGrouptChat 
router.post('chat/group', requireLogin, (req, res)=> {

})


//rename reanameGroup
router.put('chat/rename', requireLogin, (req, res)=> {

})

//groupremove removeFromGroup
router.put('/chat/groupremove', requireLogin, (req, res) => {

})

//groupadd addtoGroup
router.put('/chat/groupadd', requireLogin, (req, res) => {

})

module.exports = router