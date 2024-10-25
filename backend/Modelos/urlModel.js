
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
        allowNull:true,
        field:"created_at"
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
        timestamps: false
    });
    
    Url.belongsTo(User,{foreignKey:'userId'});
    User.hasMany(Url, { foreignKey: 'userId' });

module.exports = Url