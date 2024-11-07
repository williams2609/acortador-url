const express = require('express');
const router = express.Router()
const verifyToken = require('../Middleware/verifyToken')
const Click = require('../Modelos/clickModel'); 
const Sequelize = require('sequelize');

router.get('/clicks/daily',verifyToken, async(req,res)=>{
    const { url_id } = req.query;
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1); 

    try{
        const dayliClicks = await Click.findAll({
            where: { url_id,
                click_time: {
                    [Sequelize.Op.gte]: lastDay, // Filtra clics del último día
                },
             },
            attributes: [
            [Sequelize.fn('DATE',Sequelize.col('click_time')),'date'],
            [Sequelize.fn('COUNT',Sequelize.col('id')),'clicks']
            ],group:['date'],
            order:[['date','ASC']]
        })
        return res.status(200).json(dayliClicks)

    }catch(err){
        console.error('Error En /clicks/dayly',err)
        res.status(500).send({error:'Error interno en el Servidor'})
    }
})
router.get('/clicks/hourly',verifyToken, async(req,res)=>{
    const { url_id } = req.query;

    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours()-1 );

    try{
        const hourlyClicks = await Click.findAll({
            where: { url_id,
                click_time: {
                    [Sequelize.Op.gte]: lastHour, // Filtra clics del último día
                },
             },
            attributes: [
            [Sequelize.fn('DATE_FORMAT',Sequelize.col('click_time'), '%Y-%m-%d %H:00:00'),'hour'],
            [Sequelize.fn('COUNT',Sequelize.col('id')),'clicks']
            ],group:['hour'],
            order:[['hour','ASC']]
        })
        return res.status(200).json(hourlyClicks)
        
    }catch(err){
        console.error('Error En /clicks/hourly',err)
        res.status(500).send({error:'Error interno en el Servidor'})
    }
})


module.exports = router