import authMiddleware from '../middlewares/auth.js'
import { Bid, Product } from '../orm/index.js'
import express from 'express'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.delete('/api/bids/:bidId',authMiddleware, async (req, res) => {
  let bid= await Bid.findOne({where : {id : req.params.bidId}}, {include : {all:true}})
  
  if(bid == null){
    res.sendStatus(404)
  }
  else{
  if(bid.bidderId  == req.user.id || req.user.admin){
    await Bid.destroy({where : {id : bid.id}})
    res.sendStatus(204);
  }
  else{
    res.sendStatus(403)
  }
}

})

router.post('/api/products/:productId/bids',authMiddleware, async (req, res) => {

  let product= await Product.findOne({where : {id : req.params.productId}}, {include : {all:true}})
  
  if(product == null){
    res.sendStatus(404)
  }
  else{
  try{  
  let bid = req.body;
  bid.productId = product.id;
  bid.bidderId = req.user.id;
  bid.date = new Date();

  let b2 = await Bid.create(bid)
  res.status(201).json(b2)
  }
  catch(e){

    res.status(400).json({ error: "Invalid or missing fields" , details : e}).send()

  }
}

})

export default router
