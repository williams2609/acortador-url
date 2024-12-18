const express = require('express');
const router = express.Router();
const { generateShortUrl, isUrlExist, isOriginalUrlExist, isValidUrl } = require('../utilities/urlUtilities');
const User = require('../Modelos/userModel');
const Url = require('../Modelos/urlModel');
const https = require('https')
const { default: axios } = require('axios');

// Ruta para acortar URLs
router.post('/acortar', async (req, res) => {
    const { original_url } = req.body;
    const is_paid_user = req.body.is_paid_user || false;

    const checkedUrl = async (url)=>{
        
        if(!/^https?:\/\//i.test(url)){
            url = 'http://' + url; }

        const agent = new https.Agent({
            rejectUnauthorized : false
        });
        try{
            const response = await axios.get(url, {httpsAgent: agent})
            return response.status >= 200 && response.status <= 400; 
        }catch(err){
            return false
        }
    }

    // Validar la URL original
    if (!isValidUrl(original_url)) {
        return res.status(400).send({ error: "Por favor ingrese una URL válida" });
    }
    const validUrl = await checkedUrl(original_url)
    if(!validUrl){
        return res.status(400).send({error : 'la URL no existe'})
    }

    try {
        const existOriginalUrl = await Url.findOne({where:{original_url}});
        if (existOriginalUrl) {
            return res.status(200).send({
                short_url: existOriginalUrl.short_url,
                expiration_date: existOriginalUrl.expiration_date
            });
        }

        const generateUniqueShortUrl = async () => {
            let short_url;
            do {
                short_url = generateShortUrl();
            } while (await Url.findOne({where:{short_url}}));

            const expiration_date = is_paid_user ? null : new Date(new Date().setMonth(new Date().getMonth() + 1));

            // Si no existe, inserta en la base de datos
           const newUrl = await Url.create({
            original_url,
            short_url,
            expiration_date
           })
           return {original_url: newUrl.original_url,short_url:newUrl.short_url, expiration_date:newUrl.expiration_date}
        };

        const result = await generateUniqueShortUrl();
        return res.status(201).send(result);
    } catch (error) {
        console.error('Error en /acortar:', error);
        return res.status(500).send({ error: "Ha ocurrido un error Interno" });
    }
});

// Ruta para redirigir URLs
router.get('/:short_url', async (req, res) => {
    const { short_url } = req.params;
    const urlEntry = await Url.findOne({where: {short_url}});
    

    if (urlEntry) {
        const { expiration_date,original_url } = urlEntry;

        if (expiration_date && new Date(expiration_date) < new Date()) {
            return res.status(404).send({ error: 'Esta URL ha Expirado' });
        }

        return res.redirect(original_url);
    } else {
        return res.status(404).send({ error: 'Página no encontrada' });
    }
});

router.put('/modificar/:short_url',async (req,res)=>{
    const { short_url } = req.params;
    const { new_short_url } = req.body;

    if(!new_short_url || new_short_url.trim()=== ("")){
        return res.status(400).send({erro: 'Porfavor ingrese una Url'})
    }
    try{
        const urlEntry = await Url.findOne({where: {short_url}})
        if(!urlEntry){
            return res.status(400).send({error:'la url corta no existe'})
        }
        const urlShortExist = await Url.findOne({where:{short_url}})
        if (urlShortExist){
            return res.status(400).send({error:'la Nueva url corta ya existe'})
        }
        urlEntry.short_url = new_short_url
        await urlEntry.save()
return res.status(200).send({error:'La url corta fue modificada correctamente'})

    }catch(error){
        return res.status(500).send({error: 'Error interno en el servidor'})
    }


});

module.exports = router;    