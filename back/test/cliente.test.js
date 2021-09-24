const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('register back as Json', async ()=>{
    
    const nuevoCliente = {
        nombres : 'Pablo',
        apellidos : 'Prieto',
        email : 'pablo@correo.cl',
        password : '12345' ,
        telefono : '9111111'
    }
    
    await api
        .post('http://localhost:4201/api/registro_cliente')
        .send(nuevoCliente)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})