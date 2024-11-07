const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Asegúrate de importar la configuración de Sequelize
const Url = require('./urlModel'); // Importa el modelo Url para establecer la relación

const Click = sequelize.define('Click', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    url_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Url,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    click_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'clicks',
    timestamps: false, // Desactiva createdAt y updatedAt ya que tenemos click_time
});

Url.hasMany(Click, { foreignKey: 'url_id', onDelete: 'CASCADE' });
Click.belongsTo(Url, { foreignKey: 'url_id' });

module.exports = Click;