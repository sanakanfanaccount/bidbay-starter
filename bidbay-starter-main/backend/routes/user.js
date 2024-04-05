import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

/**
 * Endpoint pour récuperer les infos d'un utilisateur
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.get('/api/users/:userId', async (req, res) => {
  /** @type {UserObject | null} */
  //Essayer de récuperer un utilisateur
  let user = await User.findOne({where : {id : req.params.userId}, include:{all: true,nested: true}})
  //Si aucun utilisateur trouvé
  if(user != null){
    //Renvoyer OK avec les données de l'utilisateur
    res.status(200).json(user)
  }else{
    //Renvoyer 404 non trouvé
    res.status(404).send()}
})

export default router