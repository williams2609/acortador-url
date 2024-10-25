
const {DataTypes, Sequelize}= require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User',{
    username:{
        type:DataTypes.STRING,
        allowNull: false,
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
    },is_paid_user:{
        type:DataTypes.BOOLEAN,
    defaultValue : false,},
    subscriptionType:{
        type:DataTypes.ENUM('basic','platino','diamante'),
        allowNull:true,
        defaultValue:"basic",
    }
    },{
        tableName:"users"
    });

module.exports = User;