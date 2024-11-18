const User = require('../Modelos/userModel');
const crypto = require('crypto');
const express = require('express');
const app = express();
const verifyToken = require('../Middleware/verifyToken')

const generateApiKey = ()=>{
    return crypto.randomBytes(32).toString('hex')
}

app.post('/generate-api-key',verifyToken,async (req,res)=>{

    try{
        const user = await User.findByPk(req.user.id)

        if(user.api_token !== null){
            return res.status(400).send({error:'ya tienes un api key generada'})
        }
        const newApiKey = generateApiKey();
        user.api_token = newApiKey
        await user.save()

        return res.status(201).send({ 
            message: 'API Key generada exitosamente',
            api_key: user.api_token,
            created_at: user.api_token_created_at 
        });

    }catch(err){
        console.error('error en /generate-api-key',err)
        res.status(500).send({err:'Error interno del servidor'})
    }

})
app.get('/api-keys', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        if (!user.api_token) {
            return res.status(404).send({ error: 'No tienes ninguna API Key generada' });
        }

        return res.status(200).send({
            message: 'API Key recuperada exitosamente',
            api_key: user.api_token,
            // Fecha de creación si la tienes
        });
    } catch (err) {
        console.error('Error en /api-keys:', err);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});
app.delete('/api-keys', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        if (!user.api_token) {
            return res.status(400).send({ error: 'No tienes una API Key para eliminar' });
        }

        user.api_token = null;
        await user.save();

        return res.status(200).send({ message: 'API Key eliminada correctamente' });
    } catch (err) {
        console.error('Error en /api-keys DELETE:', err);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});
module.exports = app