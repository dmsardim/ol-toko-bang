'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Balance)
      User.hasMany(models.Item)
    }

    get greeting() {
      return `Assalamualaikum ${this.name}`
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required!"
        },
        notEmpty: {
          msg: "Name is required!"
        }
      }
    },
    email: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email is required!"
        },
        notEmpty: {
          msg: "Email is required!"
        }
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required!"
        },
        notEmpty: {
          msg: "Password is required!"
        },
        len: {
          args: [5,11],
          msg: "Password must be between 5-11"
        }
      }
    },
    noHandphone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "No Handphone is required!"
        },
        notEmpty: {
          msg: "No Handphone is required!"
        },
        checkTelephoneNumber(value) {
          if (value.slice(0,3) != "+62") throw new Error("Telephone number prefix must be +62!");
        },
      }
    }, 
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role is required!"
        },
        notEmpty: {
          msg: "Role is required!"
        }
      }
    },
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, option) => {
        var salt = bcrypt.genSaltSync(6);
        var hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
      }
    }
  });
  return User;
};