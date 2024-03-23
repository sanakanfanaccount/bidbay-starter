import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.use(express.json())


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


router.post('/api/products',authMiddleware, async (req, res, next) =>  {
  let product = req.body;
  product.sellerId = req.user.id
try{
  let p2 = await Product.create(product)
  res.status(201).json(p2)
}
catch(e){
    res.status(400).json({ error: "Invalid or missing fields" , details : e}).send()
}

})

router.put('/api/products/:productId',authMiddleware, async (req, res) => {

  let product= await Product.findOne({where : {id : req.params.productId}}, {include : {all:true}})
  
  if(product == null){
    res.sendStatus(404)
  }
  else{
  if(product.sellerId  == req.user.id || req.user.admin){
    await Product.update(req.body,{where : {id : product.id}})
    res.sendStatus(200);
  }
  else{
    res.sendStatus(403)
  }
}  
})

router.delete('/api/products/:productId',authMiddleware, async (req, res) => {
  let product= await Product.findOne({where : {id : req.params.productId}}, {include : {all:true}})
  
  if(product == null){
    res.sendStatus(404)
  }
  else{
  if(product.sellerId  == req.user.id || req.user.admin){
    await Product.destroy({where : {id : product.id}})
    res.sendStatus(204);
  }
  else{
    res.sendStatus(403)
  }
}
  
})

export default router
