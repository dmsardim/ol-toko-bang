'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Saldo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Saldo.belongsTo(models.User)
    }

    formatSaldo() {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(this.amount);
    }
  }
  Saldo.init({
    amount: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Saldo',
    hooks: {
      beforeCreate: (saldo, option) => {
        saldo.amount = 0
      }
    }
  });
  return Saldo;
};