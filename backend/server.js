const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Usar mysql2 con promesas
require('dotenv').config()
const sequelize = require('./db');
const User = require('./Modelos/userModel')

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
	req.sequelize = sequelize
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
sequelize.sync().then(()=>{
	app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

}).catch((error)=>{
	console.error('Error Al sincronizar la base de datos: ', error)
})
