const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // Usar mysql2 con promesas

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lobo29615943',
    database: 'acortador_url',
});

// Función para generar una URL corta
function generateShortUrl() {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Función para validar la URL
function isValidUrl(url) {
    const isValid = new RegExp('^(https?:\\/\\/)?' + // Protocolo
        '((([a-z0-9][-a-z0-9]*[a-z0-9])?\\.)+[a-z]{2,}|' + // Dominio
        'localhost|' + // localhost
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP
        '(\\:\\d+)?(\\/[-a-z0-9%_.~+:]*)*' + // Puerto y ruta
        '(\\?[;&a-z0-9%_.~+=-]*)?' + // Parámetros de consulta
        '(\\#[-a-z0-9_]*)?$', 'i');

    return isValid.test(url);
}

// Función para verificar si la URL corta existe
async function isUrlExist(short_url) {
    const query = 'SELECT COUNT(*) AS count FROM urls WHERE short_url = ?';
    const [rows] = await pool.query(query, [short_url]);
    return rows[0].count > 0;
}

async function isOriginalUrlExist(original_url) {
	const query = 'SELECT short_url ,expiration_date FROM urls WHERE original_url = ?';
	const [rows] = await pool.query(query, [original_url]);
	return rows.length > 0 ? rows[0] : null;
}


// Ruta para acortar URLs
app.post('/acortar', async (req, res) => {
    const { original_url } = req.body;
		const is_paid_user = req.body.is_paid_user || false
   
    // Validar la URL original
    if (!isValidUrl(original_url)) {
        return res.status(400).send({ error: "Por favor ingrese una URL válida" });
    }


    try {
			const existOriginalUrl = await isOriginalUrlExist(original_url)
				if(existOriginalUrl){
					
					return res.status(200).send({
						short_url: existOriginalUrl.short_url,
						expiration_date: existOriginalUrl.expiration_date
					})
				}

        const generateUniqueShortUrl = async () => {
            const short_url = generateShortUrl();
            if (await isUrlExist(short_url)) {
                // Si existe, intenta generar una nueva URL corta
                return generateUniqueShortUrl();
            }
						const expiration_date = is_paid_user ? null : new Date(new Date().setMonth(new Date().getMonth() + 1))

            // Si no existe, inserta en la base de datos
            const query = 'INSERT INTO urls (original_url, short_url, expiration_date) VALUES (?, ?, ?) ';
            await pool.query(query, [original_url, short_url, expiration_date]);
            return { original_url, short_url,expiration_date };
        };
			

        const result = await generateUniqueShortUrl();
        return res.status(201).send(result);
    } catch (error) {
			console.error('Error en /acortar ')
        return res.status(500).send({ error: error.message });
    }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send("API de acortador de URL");
});

app.get('/:short_url', async(req,res)=>{
	const {short_url} = req.params;
	const query = `SELECT original_url, expiration_date FROM urls WHERE short_url = ?`;
	const [rows] = await pool.query(query,[short_url])

		if(rows.length > 0 ){
			const {expiration_date} = rows[0]

				if(expiration_date && new Date(expiration_date) < new Date()){
					return res.status(404).send({error: 'Esta URL ha Expirado'})
				}

			return res.redirect(rows[0].original_url)
		} else{
			return res.status(404).send({error: 'pagina no encontrada'})
		}
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});