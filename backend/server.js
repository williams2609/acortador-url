const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Usar mysql2 con promesas
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
app.use((req,res,next)=>{
	req.pool = pool
	next()
})
const urlRoutes = require('./Controllers/urlController')
app.use('/url',urlRoutes)

const userRoutes = require('./Controllers/authController')
app.use('/api/users',userRoutes)

app.get('/', (req, res) => {
	res.send("API de acortador de URL");
});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});