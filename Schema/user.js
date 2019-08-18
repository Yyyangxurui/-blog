const { Schema } = require("./connect")

const UserSchema = new Schema({
    username: String,
    password: String,
    role:{
        type: String,
        default: 1
    },
    avatar: {
        type: String,
        default: "/avatar/default.jpg"
    },
    articleNum: 0,
    commentNum:0
},{versionKey:false})
module.exports = UserSchema