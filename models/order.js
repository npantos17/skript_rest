'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Car, User, Seller}) {
      // define association here
      //this.hasOne(Car)
      //this.belongsTo(Seller)
      //this.belongSto(User, {forei})

    }
  };
  Order.init({
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};