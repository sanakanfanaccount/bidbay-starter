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
    res.status(404).send()}

})


// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)


router.post('/api/products', (req, res) => {
  console.log(req.user.id)
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
