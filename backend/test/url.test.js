const request = require('supertest');
const { app ,sequelize } = require('../server');
const Url = require('../Modelos/urlModel');
const User = require('../Modelos/userModel');
const jwt = require('jsonwebtoken')

let token;



beforeAll(async ()=>{
    await sequelize.sync({force: true});

    const user = await User.create({

        username: 'testUser',
        password: 'testPassword',
        email: 'test@example.com',
        phone_number: '123456789',
        subscriptionType: 'platino',
        is_paid_user: true,
    });
    
    token = jwt.sign({id: user.id,subscriptionType: user.subscriptionType,is_paid_user: user.is_paid_user},process.env.JWT_SECRET);
});

afterEach(async ()=>{
    await Url.destroy({ where: {} })
});

describe('Pruebas para la api Url',()=>{
    it('deberia Acortar la url', async()=>{
        const res = await request(app)
        .post('/acortar')
        .set('Authorization',`Bearer ${token}`)
        .send({original_url: 'https://google.com'})

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('short_url')
        expect(res.body).toHaveProperty('expiration_date')
    });

    it('Deberia devolver la url acortada por el usuario', async()=>{
        await Url.create({
            original_url: 'https://www.google.com',
            short_url: 'abc123',
            userId: 1,
        })

        const res = await request(app)
        .get('/user-urls')
        .set('Authorization',`Bearer ${token}`)
        
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty('short_url')
    });
    it('deberia modificar una url',async()=>{
        const url = await Url.create({
            original_url: 'https://www.google.com',
            short_url: 'abc123',
            userId: 1,
        });

        const res = await request(app)
        .put(`/modificar/${url.short_url}`)
        .set('Authorization',`Bearer ${token}`)
        .send({ new_short_url: 'locotron' })

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message','La URL corta fue modificada correctamente');
    });
    it('deberia eliminar una url',async()=>{
       
        const url = await Url.create({
            original_url: 'https://google.com',
            short_url: 'locote',
            userId: 1
        })
        const res = await request(app)
        .delete(`/eliminar/${url.short_url}`)
        .set('Authorization',`Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message','URL eliminada correctamente')
    });
    it('deberia generar un codigo QR',async()=>{
        const url = await Url.create({
            original_url: 'https://google.com',
            short_url: 'locote',
            userId: 1
        })

        const res = await request(app)
        .put(`/generateQr/${url.short_url}`)
        .set('Authorization',`Bearer ${token}`)
        
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message','Código QR generado correctamente')
    })
    
});