const { db } = require('../Schema/connect')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')

//通过db对象创建操作user集合的模型对象
const User = db.model("users",UserSchema)


//用户注册
exports.reg = async ctx => {
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    //在user中查询username是否存在
    await new Promise((resolve,reject) => {
        //在users集合中查询
        User.find({username},(err,data) =>{
            if(err)return reject(err)
            //如果数据库没报错，判断是否存在数据
            if (data.length !== 0) {
                //已存在
                return resolve("")
            }
            //未查询到，需插入新数据到数据库
            //密码在保存数据库之前要先加密，encrypt是自定义的加密模块
             const _user = new User({
                username,
                password :encrypt(password),
                commentNum:0,
                article:0
            })

            _user.save((err,data) =>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    })
    .then(async data => {
        if (data) {
            //注册成功
            await ctx.render("isOk",{
                status:"注册成功"
            })
        }else{
            //用户已存在
            await ctx.render("isOk",{
                status:"用户已存在"
            })
        } 
    })
    .catch(async err => {
        await ctx.render("isOk",{
            status:"注册失败"
        })
    })
}


//用户登陆
exports.login = async ctx => {
    //获取post数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    await new Promise((resolve, reject) => {
        User.find({username}, (err, data) => {
          if(err)return reject(err)
          if(data.length === 0) return reject("用户名不存在")
          
            //判断数据库密码和当前输入密码：将输入密码加密后和数据库加密密码作对比
        if(data[0].password === encrypt(password)){
        return resolve(data)
        }
        resolve("")
        })
    })
    .then(async data => {
        if(!data){
            return ctx.render("isOk",{
                status:"密码不正确"
            })
        }
        //让用户在cookie里面设置username，password，加密后的密码，权限
        ctx.cookies.set("username",username,{
            domain: "localhost",
            path: "/",
            maxAge: 36e5,
            httpOnly: true,
            overwrite: false,
            signed: true
        })
        //数据库_id值
        ctx.cookies.set("uid",data[0]._id,{
            domain: "localhost",
            path: "/",
            maxAge: 36e5,
            httpOnly: true,
            overwrite: false,
            signed: true
        })
        ctx.session = {
            username,
            uid: data[0]._id,
            avatar: data[0].avatar,
            role: data[0].role
        }


        await ctx.render("isOk",{
            status:"登陆成功"

        })
    })
    .catch(async err => {
        await ctx.render("isOk",{
            status:"登录失败"
        })
    })
}
//保持用户登录状态
exports.keepLogin = async (ctx,next) =>{
    if(ctx.session.isNew){
        if (ctx.cookies.get("username")) {
            let uid = ctx.cookies.get("uid") 
            await User.findById(uid)
                    .then(data => data.avatar)


            ctx.session = {
            username: ctx.cookies.get("username"),
            uid,
            avatar
            }
        }
    }
    await next()
}
//用户退出
exports.logout = async ctx => {
    ctx.session = null
    ctx.cookies.set("username",null,{
        maxAge: 0
    })
    ctx.cookies.set("uid",null,{
        maxAge:0
    })
    //重新定向首页
    ctx.redirect("/")
}
//用户头像上传
exports.upload = async ctx => {
    const filename = ctx.req.file.filename
  
    let data = {}
  
    await User.update({_id: ctx.session.uid}, {$set: {avatar: "/avatar/" + filename}}, (err, res) => {
      if(err){
        data = {
          status: 0,
          message: "上传失败"
        }
      }else{
        data = {
          status: 1,
          message: '上传成功'
        }
      }
    })
    console.log(data)
    ctx.body =  data
  }
