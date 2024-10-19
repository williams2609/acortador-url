const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('./authMiddleware')

router.post('/register',async (req,res)=>{
    const {username,password,email,phone_number} = req.body

  try{  
    const userCreated = await req.pool.query('SELECT * FROM users WHERE username = ?',[username])
    if(userCreated[0].length > 0){
        return res.status(400).send({error : 'El Nombre del usuario ya esta en uso'})
    }
    const hashedPassword = await bcrypt.hash(password,10)

    await req.pool.query('INSERT INTO users (username,password,email,phone_number) VALUES(?,?,?,?)',[username,hashedPassword,email,phone_number])
   
    
    return res.status(200).send({message: '!Usuario creado con exito¡'})
}catch(error){
    console.error('error en /register',error)
    return res.status(500).send({error: "Error interno del servidor"})
}
})

router.post('/login', async (req,res)=>{
   const {username,password} = req.body

try{
    const [users] = await req.pool.query('SELECT * FROM users WHERE username = ?',[username]);
   const user = users[0]
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
