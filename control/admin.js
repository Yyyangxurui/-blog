const { db } = require('../Schema/connect')
const ArticleSchema = require('../Schema/article') 
//获取用户Schema，为了获取users集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users",UserSchema)

const CommentSchema = require('../Schema/comment')
const Comment = db.model("comments",CommentSchema)

//通过db对象创建操作user集合的模型对象
const Article = db.model("articles",ArticleSchema)

const fs = require("fs")
const {join} = require('path')

exports.index = async ctx => {
    if (ctx.session.isNew) {
        //没有登录
        ctx.status = 404
        return await ctx.render("404",{
            title: "404"
        })
    }
    const id = ctx.params.id
    const arr = fs.readdirSync(join(__dirname,"../views/admin"))

    let flag = false
    arr.forEach( v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "")
        if(name === id){
            flag =true
        }
    })
    if (flag) {
            await ctx.render("./admin/admin-" + id,{
                role: ctx.session.role
            })
    }else{
        status: 404,
        await ctx.render("404",{title: "404"})
    }

}