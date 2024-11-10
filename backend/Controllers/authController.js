const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const User = require('../Modelos/userModel');

router.post('/register',async (req,res)=>{
    const { username,password,email,phone_number } = req.body
    

    // Validar que todos los campos estén presentes
    if (!username || !email || !password || !phone_number) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }
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

    const token = jwt.sign({
        id: user.id,
        username: user.username,
        subscriptionType: user.subscriptionType,
        is_paid_user: user.is_paid_user
    },process.env.JWT_SECRET,
    {expiresIn: '5h'})
    return res.status(200).send({message: '!Inicio de Sesion Exitoso¡',token})
    }catch(error){
        console.error("error en /login",error);
        return res.status(500).send({error:"Error interno del servidor"})
    }
})
router.get('/me',authMiddleware,async (req,res)=>{

    try{
        const user = await User.findByPk(req.user.id ,{
            attributes:['id','username','email','phone_number','createdAt','is_paid_user','subscriptionType']
        })
        if(!user){
            return res.status(404).send({error:'Usuario no encontrado'})
        }
        return res.status(200).json(user)
    }catch(error) {
        console.log('error en /me')
        res.status(500).send({error:'Error interno en el servidor'})
    }
})
router.post('/upgrade',async(req,res)=>{
    const { userId,membership } = req.body;

    if(!userId || !membership){
        return res.status(400).send({error:'faltan datos para actualizar la suscripcion'})
    }
   try{
    const user = await User.findByPk(userId);
    if(!user){
        res.status(404).send({error:'Usuario no Encontrado'})
    }

    const is_paid_user = membership !== 'basic'
    user.subscriptionType = membership;
    user.is_paid_user = is_paid_user;
    await user.save()
    return res.status(200).send({ message: 'Suscripción actualizada con éxito' });
}catch(err){
    console.error('Error al actualizar subscripcion' ,err);
    res.status(500).send({error:'Error interno en servidor'})
}

})

module.exports = router;
