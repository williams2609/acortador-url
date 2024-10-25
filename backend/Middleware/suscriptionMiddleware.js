const User = require('../Modelos/userModel');

const subscriptionMiddleware = (requireType)=>{
    return async (req,res,next)=>{
        const userId = req.userId

        const user = await User.findByPk(userId)
        if(!user){
            return res.status(404).send({error : 'Usuario no Encontrado'})
        }
        if(!user.is_paid_user){
            return res.status(403).send({error: 'Acceso Denegado, Se requiere una subscripción'})
        }
        if(user.suscriptionType !== requireType){
            return res.status(403).send({error:'Acceso Denegado: Tipo de suscripcion insuficiente'})
        }
        next()
    }
}
module.exports = subscriptionMiddleware