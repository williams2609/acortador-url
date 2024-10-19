const jwt = require('jsonwebtoken');

const authMiddleware = (req, res,next)=>{
    const token = req.headers['authorization']?.split(" ")[1];
    if(!token){
        return res.status(401).send({error:"No se Proporciono un token de autenticacion"})
    }
    jwt.verify(token,process.env.JWT_SECRET,(error,decoded)=>{
        if(error){
            return res.status(401).send({error:'Token invalido'})
        }
        req.userId = decoded.id
        next()
    })
}
module.exports = authMiddleware