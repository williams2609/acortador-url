const request = require('supertest');
const { app, sequelize } = require('../server');
const User = require('../Modelos/userModel');

let token;

beforeAll(async () => {
    try {
        // Sincronizar la base de datos
        await sequelize.sync({ force: true }); // Reemplaza todas las tablas antes de las pruebas
        console.log('Base de datos sincronizada correctamente');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
        throw error;
    }
});

afterAll(async () => {
    await sequelize.close(); // Cierra la conexión a la base de datos
});

describe('Pruebas de Autenticación y Eliminación', () => {
    it('Debería registrar un usuario correctamente', async () => {
        const createRes = await request(app).post('/users/register').send({
            username: 'testUser',
            password: 'testpassword',
            email: 'testEmail@example.com',
            phone_number: '123456789',
        });

        expect(createRes.statusCode).toBe(201);
        expect(createRes.body).toHaveProperty('message', '!Usuario creado con exito¡');
    });

    it('Debería logear al usuario', async () => {
        const loginRes = await request(app).post('/users/login').send({
            username: 'testUser',
            password: 'testpassword',
        });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body).toHaveProperty('message', '!Inicio de Sesion Exitoso¡');
        expect(loginRes.body).toHaveProperty('token');

        // Guarda el token para las pruebas siguientes
        token = `Bearer ${loginRes.body.token}`;
    });

    it('Debería eliminar al usuario autenticado', async () => {
        const deleteRes = await request(app)
            .delete('/users/delete-user')
            .set('Authorization', token); // Usa el token para la autenticación

        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body).toHaveProperty('message', 'usuario eliminado correctamente');

        // Verifica que el usuario fue eliminado
        const deletedUser = await User.findOne({ where: { username: 'testUser' } });
        expect(deletedUser).toBeNull();
    });

    it('Debería devolver un error 404 si el usuario no existe', async () => {
        const res = await request(app)
            .delete('/users/delete-user')
            .set('Authorization', token); // Usa el token del usuario ya eliminado

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'usuario no encontrado');
    });
});