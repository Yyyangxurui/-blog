const { Schema } = require("./connect")
const ObjectId = Schema.Types.ObjectId
const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: "users"
    },//关联user集合
    tips: String
},{
    versionKey:false,timestamps:
    {
        createdAt:"created"
    }
}) 

module.exports = ArticleSchema