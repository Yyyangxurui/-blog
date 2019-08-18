const Router = require('koa-router')

//拿到控制层操作user集合的逻辑对象
const user = require('../control/user')
const article = require('../control/article')
const admin = require('../control/admin')
const comment = require('../control/comment')
const upload = require("../util/upload")

const router = new Router

//主页
router.get("/", user.keepLogin,article.getList)
//主要用来处理返回 用户登录 、 注册
router.get(/^\/user\/(?=reg|login)/,async (ctx) => {
    //show为true显示注册，false显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render("register",{show})
})

//处理用户登录 post 路由
router.post("/user/login", user.login)

//处理用户注册 post 路由
router.post("/user/reg", user.reg)

//用户退出
router.get("/user/logout",user.logout)

//文章发表页面
router.get("/article",user.keepLogin,article.addPage)

//文章添加
router.post("/article",user.keepLogin,article.add)

//分页路由
router.get("/page/:id",article.getList)

//文章详情页路由
router.get("/article/:id",user.keepLogin,article.details)

//发表评论
router.post("/comment",user.keepLogin,comment.save)

//后台管理页面 文章|评论|头像
router.get("/admin/:id",user.keepLogin,admin.index)

//头像上传
router.post("/upload",user.keepLogin,upload.single("file"),user.upload)

router.get("*",async ctx => {
    await ctx.render("404",{
        title:"404"
    })
})
module.exports = router