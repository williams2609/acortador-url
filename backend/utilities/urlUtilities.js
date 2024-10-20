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
async function isUrlExist(pool,short_url) {
    const query = 'SELECT COUNT(*) AS count FROM urls WHERE short_url = ?';
    const [rows] = await pool.query(query, [short_url]);
    return rows[0].count > 0;
}

async function isOriginalUrlExist(pool,original_url) {
	const query = 'SELECT short_url ,expiration_date FROM urls WHERE original_url = ?';
	const [rows] = await pool.query(query, [original_url]);
	return rows.length > 0 ? rows[0] : null;
}
module.exports = {
    generateShortUrl,
    isValidUrl,
    isUrlExist,
    isOriginalUrlExist
}