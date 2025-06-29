const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Alarm = sequelize.define('Alarm', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  direction: {
    type: DataTypes.STRING,
    defaultValue: 'above'
  }
});

module.exports = Alarm;
