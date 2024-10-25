const jwt = require('jsonwebtoken')
const secret = '21424683'

const verifyToken = (req, res, next) =>{
    const token = req.header['authorization'];

    if(!token){
      return res.status(403).send({error:'No se Ha Proporcionado un token'})

    }
    jwt.verify(token,secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({message: 'token no valido'})
        }
        req.user = decoded
        next()
    });
};
module.exports = verifyToken;