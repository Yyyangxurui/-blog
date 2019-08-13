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
                password :encrypt(password)
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
