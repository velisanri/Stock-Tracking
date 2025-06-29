const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const UserStock = sequelize.define('UserStock', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = UserStock;
