const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

//创建数据集合（表）模板，定义key(字段)
const userSchema = new Schema({
  userId: Schema.Types.ObjectId, //唯一标识
  userName: {
    unique: true, //唯一，不能重复
    type: String //类型为字符串
  },
  password: String,
  createDate: { //数据创建日期
    type: Date,
    default: Date.now() //默认值
  },
  avatar: String
})

//数据保存前钩子，在数据保存前对密码进行加盐加密后，再保存
userSchema.pre('save', function (next) {
  // 随机生成salt   10迭代次数
  bcrypt.genSalt(10, (err, salt) => { //等级10
    if (err) return next(err);
    //随机生成salt成功后，对密码加盐加密
    bcrypt.hash(this.password, salt, (err, hash) => { //hash是加密后的结果
      if (err) return next(err)
      console.log(hash)
      this.password = hash; //将密码改为加密后的
      next()
    })
  })
})


//在userSchema中定义comparePassword方法，返回promise，bcrypt.compare比较登录上传的密码与数据库中加密的密码
userSchema.methods = {
  comparePassword: (_password, password) => { //_password为登录上传的密码  password为数据库中加密的密码
    return new Promise((resolve, reject) => {
      // console.log(_password, password);
      bcrypt.compare(_password, password, (err, isMatch) => { //比较一样的话，isMatch为true，否则为false
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}


// 发布模型 相当创建了一个User(可视化工具会自动变小写字母加's'=> users)的集合，按照userSchema模板定义集合的字段
mongoose.model('User', userSchema)