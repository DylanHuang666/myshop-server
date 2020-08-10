const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const cartSchema = new Schema({
  productId: {
    type: ObjectId,
    ref: 'Product' // 指向联合查询的model，联合Product集合查询（把该集合productId和Product集合_id对应起来）
  },
  userId: ObjectId,
  createDate: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('Cart', cartSchema);