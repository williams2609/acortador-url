const express = require('express');
const router = express.Router();
const { generateShortUrl, isValidUrl } = require('../utilities/urlUtilities');
const Url = require('../Modelos/urlModel');
const https = require('https');
const axios = require('axios');
const verifyToken = require('../Middleware/verifyToken');

// Ruta GET /url/user-urls
router.get('/user-urls', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Obtiene el ID del usuario desde el token

        const userUrls = await Url.findAll({
            where: { userId },
            order: [['created_at', 'DESC']], // Asegúrate de usar el nombre correcto de la columna
        });

        return res.status(200).json(userUrls);
    } catch (err) {
        console.error('Error en la ruta GET /url/user-urls:', err);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});


// Ruta POST /url/acortar
router.post('/acortar', verifyToken, async (req, res) => {
    const { original_url, is_paid_user = false } = req.body; // Desestructuración
    const userId = req.user.id; // Obtiene el ID del usuario

    const checkedUrl = async (url) => {
        if (!/^https?:\/\//i.test(url)) {
            url = 'http://' + url; 
        }

        const agent = new https.Agent({ rejectUnauthorized: false });
        try {
            const response = await axios.get(url, { httpsAgent: agent });
            return response.status >= 200 && response.status <= 400; 
        } catch (err) {
            return false; // Si la URL no es accesible, retornar false
        }
    };

    // Validar la URL original
    if (!isValidUrl(original_url)) {
        return res.status(400).send({ error: "Por favor ingrese una URL válida" });
    }

    const validUrl = await checkedUrl(original_url);
    if (!validUrl) {
        return res.status(400).send({ error: 'La URL no existe' });
    }

    try {
        const existOriginalUrl = await Url.findOne({ where: { original_url } });
        if (existOriginalUrl) {
            return res.status(200).send({
                short_url: existOriginalUrl.short_url,
                expiration_date: existOriginalUrl.expiration_date,
            });
        }

        const generateUniqueShortUrl = async () => {
            let short_url;
            do {
                short_url = generateShortUrl();
            } while (await Url.findOne({ where: { short_url } }));

            const expiration_date = is_paid_user ? null : new Date(new Date().setMonth(new Date().getMonth() + 1));

            // Si no existe, inserta en la base de datos
            const newUrl = await Url.create({
                original_url,
                short_url,
                expiration_date,
                userId // Asegúrate de incluir el userId aquí
            });

            return { original_url: newUrl.original_url, short_url: newUrl.short_url, expiration_date: newUrl.expiration_date };
        };

        const result = await generateUniqueShortUrl();
        return res.status(201).send(result);

    } catch (error) {
        console.error('Error en /acortar:', error);
        return res.status(500).send({ error: "Ha ocurrido un error interno" });
    }
});

// Ruta para redirigir URLs
router.get('/:short_url',async (req, res) => {
    const { short_url } = req.params;

    try {
        const urlEntry = await Url.findOne({ where: { short_url } });

        if (urlEntry) {
            const { expiration_date, original_url} = urlEntry;
            
    
            if (expiration_date && new Date(expiration_date) < new Date()) {
                return res.status(404).send({ error: 'Esta URL ha expirado' });
            }
            await urlEntry.increment('click_count')

            return res.redirect(original_url);
        } else {
            return res.status(404).send({ error: 'Página no encontrada' });
        }
    } catch (error) {
        console.error('Error en la ruta GET /:short_url:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

// Ruta PUT /url/modificar/:short_url
router.put('/modificar/:short_url', verifyToken, async (req, res) => { // Añade el middleware aquí
    const { short_url } = req.params;
    const { new_short_url } = req.body;

    if (!new_short_url || new_short_url.trim() === "") {
        return res.status(400).send({ error: 'Por favor ingrese una nueva URL corta' });
    }

    try {
        const urlEntry = await Url.findOne({ where: { short_url } });
        if (!urlEntry) {
            return res.status(404).send({ error: 'La URL corta no existe' });
        }

        const urlShortExist = await Url.findOne({ where: { short_url: new_short_url } });
        if (urlShortExist) {
            return res.status(400).send({ error: 'La nueva URL corta ya existe' });
        }

        urlEntry.short_url = new_short_url;
        await urlEntry.save();

        return res.status(200).send({ message: 'La URL corta fue modificada correctamente' });
    } catch (error) {
        console.error('Error en /modificar/:short_url:', error);
        return res.status(500).send({ error: 'Error interno en el servidor' });
    }
});

router.delete('/eliminar/:short_url',verifyToken, async (req,res)=>{
    const { short_url } = req.params
    const userId = req.user.id
    try{
        const urlEntry = await Url.findOne({where: {short_url,userId}})
        if(!urlEntry){
            return res.status(404).send({error: 'Url No encontrada o no Autorizada'})
        }
        await urlEntry.destroy()
    }catch(err){
        console.error('Error en la ruta DELETE /eliminar/:short_url:', err);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});


module.exports = router;