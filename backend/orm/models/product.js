import { DataTypes } from 'sequelize'
import { sequelize } from '../database.js'

export default sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  originalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0
    }
  },
  pictureUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false
  }
})
