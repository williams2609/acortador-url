
const {DataTypes}= require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User',{
    username:{
        type:DataTypes.STRING,
        allowNull: false,
        anique:true,
    },
        password:{
        type: DataTypes.STRING,
        allowNull:false
    },email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },phone_number:{
        type:DataTypes.STRING,
        allowNull:false,

    }
});

module.exports = User;