const Koa = require('koa');
const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');


router.get('/getProductType', async (ctx) => {
  const Type = mongoose.model('ProductType');
  await Type.find({}).exec().then(res => {
    ctx.body = res;
  })
});

module.exports = router;