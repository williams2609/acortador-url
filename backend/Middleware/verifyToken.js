const jwt = require('jsonwebtoken');
const User = require('../Modelos/userModel'); // Importa el modelo de usuario para buscar por API key

const verifyTokenOrApiKey = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const apiKey = req.headers['x-api-key']; // Cambia a 'x-api-key' para el encabezado API key

    if (!token && !apiKey) {
        return res.status(401).send({ error: 'Token o API key no proporcionado' });
    }

    try {
        if (token) {
            // Verifica el token JWT
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).send({ error: 'Token no válido' });
                }
                req.user = user;
                req.userType = 'authenticatedUser'; // Define el tipo de usuario
                next();
            });
        } else if (apiKey) {
            // Verifica la API key buscando al usuario en la base de datos
            const user = await User.findOne({ where: { api_token: apiKey } });
            if (!user) {
                return res.status(403).send({ error: 'API key no válida' });
            }
            req.user = user;
            req.userType = 'developer'; // Define el tipo de usuario
            next();
        }
    } catch (error) {
        console.error('Error en verifyTokenOrApiKey:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = verifyTokenOrApiKey;