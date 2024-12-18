const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const User = require('../Modelos/userModel');

router.post('/register',async (req,res)=>{
    const {username,password,email,phone_number} = req.body

  try{  

    const userExist = await User.findOne({where: {username}})
    
    if(userExist){
        return res.status(400).send({error : 'El Nombre del usuario ya esta en uso'})

    }
    const userEmail = await User.findOne({where: {email}})
    if(userEmail){
        return res.status(401).send({error:'El Email ya esta en uso'})
    }

    const hashedPassword = await bcrypt.hash(password,10)

 const newUser = await User.create({
    username,
    password:hashedPassword,
    email,
    phone_number
 }) 
   
    return res.status(200).send({message: '!Usuario creado con exito¡'})

}catch(error){
    console.error('error en /register',error)
    return res.status(500).send({error: "Error interno del servidor"})
}
})

router.post('/login', async (req,res)=>{
   const {username,password} = req.body

try{
    const user = await User.findOne({where:{username}})
   if(!user){
   return res.status(401).send({error: 'Usuario o contraseña incorrecta'})
   }

   const isMatch = await bcrypt.compare(password,user.password)
   
   if(!isMatch){
    
    return res.status(401).send({error:'Usuario o contraseña incorrecta'})
   
}

    const token = jwt.sign({id: user.id,username: user.username},process.env.JWT_SECRET,{expiresIn: '3h'})
    return res.status(200).send({message: '!Inicio de Sesion Exitoso¡',token})
    }catch(error){
        console.error("error en /login",error);
        return res.status(500).send({error:"Error interno del servidor"})
    }
})

module.exports = router;
