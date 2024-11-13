const express = require('express');
const app = express();
const authRoutes = require('../Controllers/authController')
const urlRoutes = require('../Controllers/urlController')
const clickRoutes = require('../Controllers/clicksController');
const countApiRequest = require('../Middleware/apiRequest');
const verifyToken = require('../Middleware/verifyToken');

app.use(verifyToken)
app.use(countApiRequest)

app.use(authRoutes)

app.use(urlRoutes)

app.use(clickRoutes)

module.exports = app