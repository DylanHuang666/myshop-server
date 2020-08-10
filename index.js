const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const koaBody = require('koa-body')
const static = require('koa-static')
app.use(koaBody({
  multipart: true  //允许上传文件
}))
app.use(static(__dirname+"/static"))
let user = require('./controller/user.js')
let type = require('./controller/productType.js')
let product = require('./controller/product.js')
let cart = require('./controller/cart')

let router = new Router()
router.use('/user', user.routes());
router.use('/type', type.routes());
router.use('/product', product.routes());
router.use('/cart', cart.routes())
// const mongoose = require('mongoose')
// const fs = require('fs');


// 解决跨域问题
// const cors = require('koa2-cors');
// app.use(cors({
//     origin: ['http://localhost:8081'],
//     credentials: true
// }));


//初始化数据库（连接数据库，创建集合）
const { connect, initSchemas } = require('./init.js')

// (async function(){
//     await connect()
//     initSchemas()
// })()

async function initdb() {
  await connect()
  initSchemas()
}
initdb()

//执行index.js导入product.json全部数据到数据库
// fs.readFile('./data/product.json', 'utf8', (err, data) => {
//   data = JSON.parse(data);
//   console.log(data);
//   let count = 0; // 计数器
//   const Product = mongoose.model('Product');
//   data.map((value, index) => {
//       console.log(value);
//       setTimeout(function(){
//         let product = new Product(value);
//         // 随机生成类型 范围是1~8
//         product.type = Math.floor(Math.random() * 8) + 1;
//         product.save().then(() => {
//           count++;
//           console.log('成功' + count);
//       }).catch(err => {
//           console.log('失败啦:' + error);
//       });
//       },1000)    
//   });
// });


//执行index.js导入productType.json全部数据到数据库
// fs.readFile('./data/productType.json', 'utf8', (err, data) => {
//   data = JSON.parse(data);
//   let count = 0;
//   const Type = mongoose.model('ProductType');
//   data.map((value, index) => {
//       let type = new Type(value);
//       type.save().then(() => {
//           count++;
//           console.log('成功' + count);
//       }).catch(err => {
//           console.log('失败:' + err);
//       })
//   });
// });



app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3003, () => {
  console.log('3003端口 start server 后台服务开启')
})