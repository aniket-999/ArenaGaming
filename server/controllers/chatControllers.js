const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/user");

const accessChat = asyncHandler(async (req,res) => {
    const { userID } = req.body;

    if(!userId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        $ans: [
            {users: {$elemMatch:{$eq:req.user._id}}},
            {users: {$elemMatch:{$eq: userId}}},
        ],
    }).populate("users",-password)
    .populate("lastestMessage");

    isChat = await User.populate(isChat, {
        path:"latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName : "sender",
            users: [ req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
                "users",
                "-password"
            );

            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async(req,res) => {
    try{
        Chat.find({users: {$elemMatch:{$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });

            res.status(200).send(results);
        });
    } catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { accessChat, fetchChats }