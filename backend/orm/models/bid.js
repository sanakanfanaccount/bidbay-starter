import { DataTypes } from 'sequelize'
import { sequelize } from '../database.js'

export default sequelize.define('Bid', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  bidderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  }
})
