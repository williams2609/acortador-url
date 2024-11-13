const ApiRequest = require('../Modelos/apiRequest'); // Modelo de solicitud
const User = require('../Modelos/userModel'); // Modelo de usuario
const { Op } = require('sequelize');

const countApiRequest = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const subscriptionType = req.user.subscriptionType;
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

    
        const requestLimits = {
            basic: 50,
            platino: 100,
            diamante: 200,
        };

        const userLimit = requestLimits[subscriptionType] || 50; // Límite predeterminado en caso de un tipo desconocido

      
        const todayRequestCount = await ApiRequest.count({
            where: {
                user_id: userId,
                request_time: { [Op.gte]: today } 
            }
        });

     
        if (todayRequestCount >= userLimit) {
            return res.status(429).json({ error: 'Has alcanzado el límite diario de solicitudes de la API' });
        }

      
        await ApiRequest.create({
            user_id: userId,
            endpoint: req.originalUrl,
            request_time: new Date(),
        });

        next(); 
    } catch (error) {
        console.error('Error en el conteo de solicitudes de API:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = countApiRequest