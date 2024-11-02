
const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const User = require('./userModel')

const Url = sequelize.define("url",{
    original_url:{
       type: DataTypes.STRING,
       allowNull: false,
    },short_url:{
        type:DataTypes.STRING,
        allowNull:false,
    },created_at:{
        type:DataTypes.DATE,
        field:"created_at",
        defaultValue: DataTypes.NOW
    },expiration_date:{
        type:DataTypes.DATE,
        allowNull:true,
        field:"expiration_date"
    },userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'id'
        }
    }
}
    ,{
        tableName: "urls",
        timestamps: true
    });
    
    Url.belongsTo(User,{foreignKey:'userId'});
    User.hasMany(Url, { foreignKey: 'userId' });

module.exports = Url