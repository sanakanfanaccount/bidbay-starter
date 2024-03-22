import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()




router.get('/api/products', async (req, res, next) => {

  res.status(200).json(await Product.findAll({include:{all:true}}))
})


router.get('/api/products/:productId', async (req, res) => {
  let product = await Product.findOne({where : {id : req.params.productId}, include:{all: true,nested: true}})
  if(product != null){
    res.status(200).json(product)
  }else{

  console.log(req)
    res.status(404).send()}

})


// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)


router.post('/api/products',authMiddleware, (req, res, next) => {


    res.sendStatus(201);

})

router.put('/api/products/:productId',authMiddleware, async (req, res) => {

  console.log(req.headers)
  //let product = await Product.findOne({where : {id : req.params.productId}}, {include : {all:true}})
  //if( product.seller.id  == req.params.Product.User.id){  
  res.sendStatus(200);
  //}else{
    //res.sendStatus(403)
  //}
})

router.delete('/api/products/:productId',authMiddleware, async (req, res) => {
    res.sendStatus(200);
  
})

export default router
