const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String, 
        require:true,
        unique: true
    },
    password: {
        type:String,
        required:true
    },
    pic:{
        type: String,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    followers:[{type:ObjectId, ref:"User"}],
    following:[{type:ObjectId, ref:"User"}]

},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports=User;