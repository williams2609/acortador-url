const { app, sequelize } = require('./server');
const port = process.env.PORT || 5000;
require('dotenv').config();

sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada, iniciando servidor...');
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error.message);
    });