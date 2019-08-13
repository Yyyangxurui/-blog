//连接数据库 导出 db Schema
const mongoose = require('mongoose')
const db = mongoose.createConnection("mongodb://localhost:27017/blogproject",{useNewUrlParser: true})
const Schema = mongoose.Schema


mongoose.Promise = global.Promise
db.on("error",() => {
    console.log("连接失败")
})
db.on("open", () => {
    console.log("blogproject 数据库连接成功")
})



module.exports = {
    db,
    Schema
}