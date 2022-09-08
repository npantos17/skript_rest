'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Car, Order}) {
      // define association here
      //this.hasMany(Car, {foreignKey:'sellerID', as: 'cars', onDelete: 'cascade', hooks: true  })
      this.hasMany(Car)
      this.hasMany(Order)
    }
  };
  Seller.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Seller',
  });
  return Seller;
};