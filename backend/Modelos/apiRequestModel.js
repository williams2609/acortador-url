const { DataTypes } = require('sequelize');
const sequelize = require('../db')
const users = require('./userModel')
const apiRequest = sequelize.define('apiRequest',{
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'users',
            key:'id'
        },
        onDelete: 'CASCADE'
    },
    request_time:{
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },
    endpoint:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[1,355]
        }

    },
 },{
    sequelize,
    modelName: 'apiRequests',
    tableName: 'api_request',
    timestamps: true
 }
);
module.exports = apiRequest