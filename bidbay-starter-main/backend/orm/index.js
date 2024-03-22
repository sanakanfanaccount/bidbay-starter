import User from './models/user.js'
import Bid from './models/bid.js'
import Product from './models/product.js'
import { sequelize } from './database.js'

User.hasMany(Product, { as: 'products', foreignKey: 'sellerId', onDelete: 'CASCADE' })
User.hasMany(Bid, { as: 'bids', foreignKey: 'bidderId', onDelete: 'CASCADE' })

Product.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' })
Product.hasMany(Bid, { as: 'bids', foreignKey: 'productId', onDelete: 'CASCADE' })

Bid.belongsTo(Product, { as: 'product', foreignKey: 'productId' })
Bid.belongsTo(User, { as: 'bidder', foreignKey: 'bidderId' })

export async function initializeDatabase () {
  return await sequelize.sync()
}

export { User, Bid, Product }
