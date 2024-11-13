const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/verifyToken');
const Click = require('../Modelos/clickModel'); 
const Sequelize = require('sequelize');

// Ruta para obtener clics diarios en el último mes
router.get('/clicks/daily', verifyToken, async (req, res) => {
    const { url_id } = req.query;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    try {
        const dailyClicks = await Click.findAll({
            where: {
                url_id,
                click_time: {
                    [Sequelize.Op.gte]: lastMonth, // Filtra clics del último mes
                },
            },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('click_time')), 'date'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'clicks']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });
        return res.status(200).json(dailyClicks);
    } catch (err) {
        console.error('Error en /clicks/daily', err);
        res.status(500).send({ error: 'Error interno en el servidor' });
    }
});

// Ruta para obtener clics horarios en el último día
router.get('/clicks/hourly', verifyToken, async (req, res) => {
    const { url_id } = req.query;

    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);

    try {
        const hourlyClicks = await Click.findAll({
            where: {
                url_id,
                click_time: {
                    [Sequelize.Op.gte]: lastDay, // Filtra clics del último día
                },
            },
            attributes: [
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('click_time'), '%Y-%m-%d %H:00:00'), 'hour'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'clicks']
            ],
            group: ['hour'],
            order: [['hour', 'ASC']]
        });
        return res.status(200).json(hourlyClicks);
    } catch (err) {
        console.error('Error en /clicks/hourly', err);
        res.status(500).send({ error: 'Error interno en el servidor' });
    }
});

// Nueva ruta para obtener el total de clics de una URL específica
router.get('/clicks/total', verifyToken, async (req, res) => {
    const { url_id } = req.query;

    try {
        const clicksWithTimestamp = await Click.findAll({
            where: { url_id },
            attributes: [
                'click_time', // Incluir la marca de tiempo de cada clic
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'clicks']
            ],
            group: ['click_time'], // Agrupa por el tiempo de clic para mantener la fecha y hora de cada clic
            order: [['click_time', 'ASC']]
        });

        return res.status(200).json(clicksWithTimestamp);
    } catch (err) {
        console.error('Error en /clicks/total', err);
        res.status(500).send({ error: 'Error interno en el servidor' });
    }
});

module.exports = router;