const mongoose = require('mongoose')
const db = 'mongodb://localhost/shop' //连接数据库，localhost也可以写IP地址。端口号不写默认端口27017，shop为数据库名字（连接数据库shop,没有就自动新建一个）

const glob = require('glob')
const path = require('path')
// 引入 schema
exports.initSchemas = () => {
  glob.sync(path.resolve(__dirname, './model', '*.js')).forEach(require) //把model文件夹下面所有js文件引进来
}



//连接数据库
exports.connect = () => {
  mongoose.connect(db, {
    useNewUrlParser: true
  })
  //监听数据库连接失败
  mongoose.connection.on('disconnected', () => {
    //失败就重连一次
    mongoose.connect(db)
  })
  //监听数据库出现错误
  mongoose.connection.on('error', err => {
    console.log(err)
    //重连
    mongoose.connect(db)
  })
  // 连接上的时候
  mongoose.connection.once('open', () => {
    console.log('mongodb connected success 连接数据库成功')
  })
}