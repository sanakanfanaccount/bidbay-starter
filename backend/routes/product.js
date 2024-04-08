import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.use(express.json())

/**
 * Endpoint pour récupérer tous les produits
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
router.get('/api/products', async (req, res, next) => {
  try {
    /** @type {ProductObject | null} */
    // Récupérer tous les produits avec toutes les associations
    const products = await Product.findAll({ include: { all: true } })
    res.status(200).json(products)
  } catch (error) {
    console.error('Error:', error)
    res.sendStatus(500)
  }
})

/**
 * Endpoint pour récupérer un produit par son ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.get('/api/products/:productId', async (req, res) => {
    /** @type {ProductObject | null} */
    // Trouver un produit par son ID avec toutes les associations
    await Product.findOne({ where: { id: req.params.productId }, include: { all: true, nested: true } })
    .then( async (product) => {
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).send()
    }
    }).catch((error)=>{
    console.error('Error:', error)
    res.sendStatus(500);
  });
})

/**
 * Endpoint pour créer un nouveau produit
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
router.post('/api/products', authMiddleware, async (req, res, next) => {
  try {
    /** @type {ProductObject | null} */
    // Créer un nouveau produit avec le vendeur associé
    let product = req.body;
    product.sellerId = req.user.id;
    /** @type {ProductObject | null} */
    const newProduct = await Product.create(product);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error:', error)
    res.status(400).json({ error: 'Invalid or missing fields', details: getDetails(error) })
  }
})

/**
 * Endpoint pour mettre à jour un produit existant
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.put('/api/products/:productId', authMiddleware, async (req, res) => {
  try {
    // Trouver le produit à mettre à jour
    /** @type {ProductObject | null} */
    const product = await Product.findOne({ where: { id: req.params.productId } });
    if (!product) {
      return res.sendStatus(404);
    }
    // Vérifier les autorisations
    if (product.sellerId !== req.user.id && !req.user.admin) {
      return res.sendStatus(403);
    }
    // Mettre à jour le produit
    await Product.update(req.body, { where: { id: req.params.productId } });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error:', error)
    res.sendStatus(500);
  }
})

/**
 * Endpoint pour supprimer un produit existant
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.delete('/api/products/:productId', authMiddleware, async (req, res) => {
  try {

    /** @type {ProductObject | null} */
    // Trouver le produit à supprimer
    const product = await Product.findOne({ where: { id: req.params.productId } });
    if (!product) {
      return res.sendStatus(404);
    }
    // Vérifier les autorisations
    if (product.sellerId !== req.user.id && !req.user.admin) {
      return res.sendStatus(403);
    }
    // Supprimer le produit
    await Product.destroy({ where: { id: req.params.productId } });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error:', error)
    res.sendStatus(500);
  }
})

export default router
