
const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const User = require('./userModel')

const Url = sequelize.define("Url",{
    original_url:{
       type: DataTypes.STRING,
       allowNull: false,
       unique: true
    },short_url:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },created_at:{
        type:DataTypes.DATE,
        allowNull:true,
        field:"created_at"
    },expiration_date:{
        type:DataTypes.DATE,
        allowNull:true,
        field:"expiration_date"
    }
}
    ,{
        tableName: "urls",
        timestamps: false
    });
    
    Url.belongsTo(User,{foreignKey:'userId'});

module.exports = Url