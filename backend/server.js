const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Usar mysql2 con promesas
require('dotenv').config()
const sequelize = require('./db');
const User = require('./Modelos/userModel')
const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require('./Routes/apiRoutes')

app.use(cors());
app.use(express.json());


app.use((req,res,next)=>{
	req.sequelize = sequelize
	next()
})
const urlRoutes = require('./Controllers/urlController')
app.use(urlRoutes)
const clickRoUtes = require('./Controllers/clicksController')
app.use(clickRoUtes)
const userRoutes = require('./Controllers/authController')
app.use('/users',userRoutes)
app.get('/', (req, res) => {
	res.send("API de acortador de URL");
});
app.use('/api', apiRoutes)
const apiKeyRoute = require('./Controllers/apiController')
app.use(apiKeyRoute)


app.use((err, req, res, next) => {
    console.error('Error interno:', err);
    res.status(500).send({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
sequelize.sync().then(()=>{
	app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

}).catch((error)=>{
	console.error('Error Al sincronizar la base de datos: ', error)
})
