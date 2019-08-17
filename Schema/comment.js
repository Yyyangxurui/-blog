const { Schema } = require("./connect")
const ObjectId = Schema.Types.ObjectId
const CommentSchema = new Schema({
    //头像  用户名
    //文章
    //neirong
    content: String,
    //关联用户集合
    from:{
        type: ObjectId,
        ref: "users"
    },
    //关联article集合
    article:{
        type: ObjectId,
        ref: "articles"
    }


},{
    versionKey:false,timestamps:
    {
        createdAt:"created"
    }
}) 

module.exports = CommentSchema