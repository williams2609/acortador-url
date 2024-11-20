const express = require("express");
const cors = require("cors");
require('dotenv').config();
const sequelize = require('./db');
const port = process.env.PORT || 5000;
const apiRoutes = require('./Routes/apiRoutes');
console.log('DB_USER:', process.env.DB_USER);
const app = express();
app.use(cors());
app.use(express.json());

const urlRoutes = require('./Controllers/urlController');
const clickRoutes = require('./Controllers/clicksController');
const userRoutes = require('./Controllers/authController');
const apiKeyRoute = require('./Controllers/apiController');

app.use(urlRoutes);
app.use(clickRoutes);
app.use('/users', userRoutes);
app.get('/', (req, res) => res.send("API de acortador de URL"));
app.use('/api', apiRoutes);
app.use(apiKeyRoute);

app.use((err, req, res, next) => {
    console.error('Error interno:', err);
    res.status(500).send({ error: 'Error interno del servidor' });
});

if (process.env.NODE_ENV !== 'test') {
    sequelize.sync().then(() => {
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    }).catch(err => {
        console.error('Error al conectar la base de datos:', err.message);
        process.exit(1); // Salir si la base de datos falla
    });
}

module.exports = { app, sequelize }; 