const request = require('supertest');
const app = require('../server');

describe('Pruebas de Autenticación',()=>{
    it('Deberia registrar un usuario Correctamente', async ()=>{
        const res = (await request(app).post('/users/register')).send({
            username: 'testuser',
            password: 'testpassword',
            email: 'test@example.com',
            phone_number: '123456789'
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('message','!Usuario creado con exito¡')
    })
})