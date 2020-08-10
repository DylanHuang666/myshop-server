const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.get('/getProductsByType', async (ctx) => {
  const Product = mongoose.model('Product');
  await Product.find({
    type: ctx.query.typeId
  }).skip(parseInt(ctx.query.start)).limit(parseInt(ctx.query.limit)).exec().then(res => {
    ctx.body = res;
  })
});

router.get('/getDetail', async (ctx) => {
  const Product = mongoose.model('Product');
  await Product.findOne({
    _id: ctx.query.id
  }).exec().then(res => {
    ctx.body = res;
  })
});

module.exports = router;