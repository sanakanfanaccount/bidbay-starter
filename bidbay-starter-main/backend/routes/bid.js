import authMiddleware from '../middlewares/auth.js'
import { Bid, Product } from '../orm/index.js'
import express from 'express'

const router = express.Router()

/**
 * Supprime une enchère spécifique par ID
 * @param {string} '/api/bids/:bidId' L'identifiant de l'enchère
 * @param {function} authMiddleware Middleware pour vérifier le JWT 
 * @param {import('express').Request<{bidId: string}, {}, {}>} req
 * @param {import('express').Response} res  
 * @returns {void} Retourne un code de statut HTTP :
 * 204 -> OK, l'enchère a été supprimée de la base de données avec succès
 * 401 -> Token invalide (Authentification manquante)
 * 403 -> Autorisations manquantes (Non le créateur de l'enchère ou administrateur)
 * 404 -> Enchère incorrecte (Impossible à trouver)
 */
router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  try {
    // Essayer de trouver une enchère avec l'ID spécifié
    /** @type {BidObject | null} */
    const bid = await Bid.findOne({ where: { id: req.params.bidId } })

    // Si l'enchère n'existe pas
    if (!bid) {
      return res.sendStatus(404)
    }

    // Vérifier si l'utilisateur est le créateur de l'enchère ou s'il est administrateur
    if (bid.bidderId === req.user.id || req.user.admin) {
      // Supprimer l'enchère
      await Bid.destroy({ where: { id: bid.id } })
      // Renvoyer OK
      res.sendStatus(204)
    } else {
      // Autorisations manquantes
      res.sendStatus(403)
    }
  } catch (error) {
    // Gérer les erreurs
    console.error('Error:', error)
    res.sendStatus(500)
  }
})

/**
 * Crée une enchère pour un produit spécifique dans la base de données avec la méthode POST
 * @param {string} '/api/products/:productId/bids'
 * @param {function} authMiddleware Middleware d'authentification
 * @returns {void} Retourne un code de statut HTTP :
 * 201 -> OK, l'enchère a été créée avec succès
 * 400 -> Requête incorrecte, requête mal construite (valeurs manquantes ou invalides)
 * 401 -> Token invalide (Authentification manquante)
 */
router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  try {
    // Essayer de trouver un produit avec l'ID spécifié
    /** @type {ProductObject | null} */
    const product = await Product.findOne({ where: { id: req.params.productId } })

    // Si le produit n'existe pas
    if (!product) {
      return res.sendStatus(404)
    }

    /** @type {BidObject | null} */
    // Créer une nouvelle enchère
    const bid = await Bid.create({
      productId: product.id,
      bidderId: req.user.id,
      date: new Date(),
    })

    // Renvoyer OK avec l'enchère créée
    res.status(201).json(bid)
  } catch (error) {
    // Gérer les erreurs
    console.error('Error:', error)
    res.status(400).json({ error: 'Invalid or missing fields' })
  }
})

export default router
