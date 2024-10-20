const express = require('express');
const router = express.Router();
const { generateShortUrl, isUrlExist, isOriginalUrlExist, isValidUrl } = require('../utilities/urlUtilities');

// Ruta para acortar URLs
router.post('/acortar', async (req, res) => {
    const { original_url } = req.body;
    const is_paid_user = req.body.is_paid_user || false;

    // Validar la URL original
    if (!isValidUrl(original_url)) {
        return res.status(400).send({ error: "Por favor ingrese una URL válida" });
    }

    try {
        const existOriginalUrl = await isOriginalUrlExist(req.pool, original_url);
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
            } while (await isUrlExist(req.pool, short_url));

            const expiration_date = is_paid_user ? null : new Date(new Date().setMonth(new Date().getMonth() + 1));

            // Si no existe, inserta en la base de datos
            const query = 'INSERT INTO urls (original_url, short_url, expiration_date) VALUES (?, ?, ?)';
            await req.pool.query(query, [original_url, short_url, expiration_date]);
            return { original_url, short_url, expiration_date };
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
    const query = `SELECT original_url, expiration_date FROM urls WHERE short_url = ?`;
    const [rows] = await req.pool.query(query, [short_url]);

    if (rows.length > 0) {
        const { expiration_date } = rows[0];

        if (expiration_date && new Date(expiration_date) < new Date()) {
            return res.status(404).send({ error: 'Esta URL ha Expirado' });
        }

        return res.redirect(rows[0].original_url);
    } else {
        return res.status(404).send({ error: 'Página no encontrada' });
    }
});

module.exports = router;