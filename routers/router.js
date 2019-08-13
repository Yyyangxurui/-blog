const Router = require('koa-router')

//拿到控制层操作user集合的逻辑对象
const user = require('../control/user')

const router = new Router

//主页
router.get("/",async (ctx) => {
    await ctx.render("index")
})
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

module.exports = router