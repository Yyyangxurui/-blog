//注册模块 koa koa-static koa-views koa-logger koa-body koa-router pug mongoose koa-session
const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const logger = require('koa-logger')
const body = require('koa-body')
const {join} = require('path')
const session = require('koa-session')
//生成koa实例
const app = new Koa

//session的配置对象CONFIG
app.keys = ["This is a YXR blog"]

const CONFIG = {
    key: "Sid",
    maxAge :63e5,
    overwriter: true,
    httpOnly: true,
    signed: true,
    rolling: true

}
//注册日志模块
app.use(logger())
//配置session
app.use(session(CONFIG,app))
//配置koa-body 处理 post 请求数据
app.use(body())
//配置静态资源目录
app.use(static(join(__dirname,"public")))
//配置视图模板
app.use(views(join(__dirname,"views"),{
    extension:"pug"
}))


//注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods())
app.listen(3000,() => {
    console.log("启动成功")
})