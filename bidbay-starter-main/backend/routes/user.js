import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

let users = import('../orm/models/user.js')

router.get('/api/users/:userId', async (req, res) => {

  res.status(200).json(User.findAll({where : {id : req.params.userId}})).send()
})

export default router
