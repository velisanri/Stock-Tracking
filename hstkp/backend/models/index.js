const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const User = require('./User');
const UserStock = require('./UserStock');
const Alarm = require('./Alarm'); 

// İlişkiler
User.hasMany(UserStock, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserStock.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Alarm, { foreignKey: 'userId', onDelete: 'CASCADE' }); 
Alarm.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  Sequelize,
  sequelize,
  User,
  UserStock,
  Alarm 
};
