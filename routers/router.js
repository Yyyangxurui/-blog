const Router = require('koa-router')
const router = new Router

//主页
router.get("/",async (ctx) => {
    await ctx.render("index")
})
//主要用来处理用户登录、注册
router.get(/^\/user\/(?=reg|login)/,async (ctx) => {
    //show为true显示注册，false显示登录
    const show = /reg$/.test(ctx.path)
    await ctx.render("register",{show})
})

module.exports = router