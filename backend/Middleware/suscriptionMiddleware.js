const User = require('../Modelos/userModel');

const subscriptionMiddleware = (requireType) => {
    return (req, res, next) => {
        // Verifica que `req.user` esté definido correctamente
        const { subscriptionType, is_paid_user, id: userId } = req.user;

        if (!userId) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        }

        if (!is_paid_user) {
            return res.status(403).send({ error: 'Acceso Denegado: Se requiere una suscripción activa' });
        }

        if (!requireType.includes(subscriptionType)) {
            return res.status(403).send({ error: 'Acceso Denegado: Tipo de suscripción insuficiente' });
        }

        next(); // Permite el acceso si cumple con todos los requisitos
    };
};
module.exports = subscriptionMiddleware