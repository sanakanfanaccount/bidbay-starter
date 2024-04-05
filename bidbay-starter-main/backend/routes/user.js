import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

/**
 * Endpoint pour obtenir les détails d'un utilisateur par son ID
 * @param {import('express').Request<{userId: string}, {}, {}>} req
 * @param {import('express').Response} res
 */
router.get('/api/users/:userId', async (req, res) => {
  try {
    /** @type {UserObject | null} */
    // Trouver l'utilisateur par son ID
    const user = await User.findOne({
      where: { id: req.params.userId },
      include: [{ model: Product, include: Bid }] // Inclure les produits et les enchères associés à l'utilisateur
    })

    // Vérifier si l'utilisateur existe
    if (user !== null) {
      res.status(200).json(user)
    } else {
      res.status(404).send('User not found')
    }
  } catch (error) {
    // Gérer les erreurs
    console.error('Error:', error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
