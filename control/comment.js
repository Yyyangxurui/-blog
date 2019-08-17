const { db } = require('../Schema/connect')
const ArticleSchema = require('../Schema/article') 
//获取用户Schema，为了获取users集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users",UserSchema)

const CommentSchema = require('../Schema/comment')
const Comment = db.model("comments",CommentSchema)

//通过db对象创建操作user集合的模型对象
const Article = db.model("articles",ArticleSchema)

//保存评论
exports.save = async ctx => {
    let message = {
      status: 0,
      msg: "登录才能发表"
    }
    // 验证用户是否登录
    if(ctx.session.isNew)return ctx.body = message
  
    // 用户登录了。
    const data = ctx.request.body
  
    data.from = ctx.session.uid
  
    const _comment = new Comment(data)
  
    await _comment
      .save()
      .then(data => {
        message = {
          status: 1,
          msg: '评论成功'
        }
        
        
        // 更新当前文章的评论计数器
    })
        // 更新用户的评论计数器
      .catch(err => {
        message = {
          status: 0,
          msg: err
        }
      })
    ctx.body = message
  }
