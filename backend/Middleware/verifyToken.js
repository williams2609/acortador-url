const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Obtiene el encabezado de autorización
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null; // Extrae el token

    if (!token) {
        return res.status(401).send({ error: 'Token no proporcionado' }); // Si no hay token, envía un error
    }

    // Verifica el token usando tu secreto
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({ error: 'Token no válido' }); // Si el token no es válido, envía un error
        }
        req.user = user; // Si es válido, guarda el usuario en la solicitud
        next(); // Llama al siguiente middleware
    });
};

module.exports = verifyToken;