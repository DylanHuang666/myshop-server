const mongoose = require('mongoose')
const Schema = mongoose.Schema

//创建数据集合（表）模板，定义key(字段)
const productSchema = new Schema({
  id: Schema.Types.ObjectId, //唯一标识
  name: String,
  img: String,
  price: String,
  company: String,
  city: String,
  type: Number
})

// 发布模型
mongoose.model('Product', productSchema)