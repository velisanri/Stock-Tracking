const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); 

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
});

module.exports = User;
