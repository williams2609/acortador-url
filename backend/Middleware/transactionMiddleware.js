const sequelize = require('../db'); // Asegúrate de importar Sequelize correctamente

const transactionMiddleware = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    req.transaction = transaction;

    try {
        await next(); // Espera a que se completen todas las operaciones
        if (!transaction.finished) { // Solo confirma si la transacción no ha terminado
            await transaction.commit();
        }
    } catch (error) {
        if (!transaction.finished) { // Solo revierte si la transacción no ha terminado
            await transaction.rollback();
        }
        next(error); // Pasa el error al manejador global
    }
};

module.exports = transactionMiddleware;