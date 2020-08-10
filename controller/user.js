const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');
const fs = require('fs')

//注册
router.post('/registUser', async (ctx) => {
  // 获取model（获取集合，'User'与发布模板的'User'对应）
  const User = mongoose.model('User');
  // 接收post请求封装成user对象
  let newUser = new User(ctx.request.body);
  // 使用save保存用户信息
  await newUser.save().then(() => {
    ctx.body = {
      code: 200,
      message: '注册成功'
    };
  }).catch(err => {
    ctx.body = {
      code: 500,
      message: '该用户名已被注册'
    };
  });
});

//登录
router.post('/loginUser', async (ctx) => {
  // 接收前端发送的数据
  let loginUser = ctx.request.body
  let userName = loginUser.userName
  let password = loginUser.password
  // 引入model
  const User = mongoose.model('User');
  // 查询用户名是否存在 存在再去比较密码
  await User.findOne({
    userName: userName
  }).exec().then(async (result) => {
    if (result) {
      let newUser = new User()
      await newUser.comparePassword(password, result.password) //userSchema中定义comparePassword方法,User实例newUser可以直接调用
        .then(isMatch => {
          // 登录成功
          if (isMatch) {
            ctx.body = {
              code: 200,
              message: '登录成功',
              userInfo: result
            };
          } else { // 登录失败
            ctx.body = {
              code: 201,
              message: '密码错误'
            }
          }
        })       
    } else {
      ctx.body = {
        code: 202,
        message: '用户名不存在'
      }
    }
  })
})

//用户上传更换头像
router.post('/uploadUserImg', async ctx => {
  const User = mongoose.model('User')
  console.log(ctx.request.body)
  console.log(ctx.request.files.avatar)
  if(ctx.request.files.avatar.size > 0){
    if(!fs.existsSync("static/img")){
      fs.mkdirSync("static/img")
    }
    let temPath = ctx.request.files.avatar.path
    fs.writeFileSync("static/img/" + ctx.request.files.avatar.name, fs.readFileSync(temPath))
    let imgUrl = "http://192.168.0.205:3003/img/" + ctx.request.files.avatar.name
    await User.findByIdAndUpdate(ctx.request.body.userId,{avatar: imgUrl},{new: true},(err, ret) => {
      if(err){
        console.log('更新失败',err)
        ctx.body = {
          code: 500,
          message: '更换失败'
        }
      }else{
        console.log('更新成功',ret)
        ctx.body = {
          code: 200,
          message: '更换头像成功',
          avatar: ret.avatar
        }
      }
    })
  }else{
    ctx.body = {
      code: 500,
      message: '更换失败'
    }
  }
})

router.get('/getUserInfo', async ctx => {
  const User = mongoose.model('User');
  let userId = ctx.query.userId
  await User.findOne({
    _id: userId
  }).exec().then(res => {
    ctx.body = {
      code: 200,
      data: {
        userId: res._id,
        userName: res.userName,
        avatar: res.avatar
      } 
    }
  }).catch(err => {
    console.log(err)
    ctx.body = {
      code: 500,
      message: '获取失败'
    }
  })
})


module.exports = router;