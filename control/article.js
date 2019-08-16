const { db } = require('../Schema/connect')
const ArticleSchema = require('../Schema/article') 

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
    data.author = ctx.session.username
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