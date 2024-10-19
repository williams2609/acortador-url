const express = require('express');
const router = express.Router();
const {shortenUrl,redirectUrl}= require('../Controllers/urlController')

router.post('/acortar',shortenUrl)

router.get('/:short_url', redirectUrl)

module.exports = router