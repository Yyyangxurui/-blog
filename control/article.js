const { db } = require('../Schema/connect')
const ArticleSchema = require('../Schema/article') 
//获取用户Schema，为了获取users集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users",UserSchema)

//通过db对象创建操作user集合的模型对象
const Article = db.model("articles",ArticleSchema)
//返回文章发表页
exports.addPage = async ctx => {
    await ctx.render("add-article",{
        title: "文章发表",
        session: ctx.session
    })
}
//文章发表，存入数据库
exports.add = async ctx => {
    if (ctx.session.isNew) {
        //没登录
        return ctx.body = {
            msg: "用户未登录",
            status: 0
        }
    }

    //用户登录后
    const data = ctx.request.body
    //添加文章作者
    data.author = ctx.session.uid
    await new Promise((resolve,reject) => {
        new Article(data).save((err,data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
    .then(data => {
        ctx.body = {
            msg: "发表成功",
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg: "发表失败",
            status: 0
        }
    })
}
//获取文章列表
exports.getList = async ctx => {
    let page = ctx.params.id ||  1
    page--
    const maxNum = await Article.estimatedDocumentCount((err,num) =>err? console.log(err):num)

    const artList = await Article
        .find()
        .sort("-created")
        .skip(5*page)
        .limit(5)
        .populate({
            path: "author",
            select: "_id username avatar",
        })//mongoose 用于连表查询
        .then(data => data)
        .catch(err => console.log(err))

    //头像
    await ctx.render("index",{
        session: ctx.session,
        title: "Blog",
        artList,
        maxNum,
    })
}