
const serverless = require('serverless-http');

const express = require('../../../Backend/node_modules/express');
const cors = require('../../../Backend/node_modules/cors');
const pool = require('../../../Backend/config/database');

const app = express();

app.use(cors({
    origin: [
        'https://theo-food.netlify.app',
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ]
}));

app.use(express.json());

app.get('/api/estado', (req, res) => {
    res.json({
        mensaje: 'Backend de THEO funcionando correctamente'
    });
});

app.get('/api/estado-db', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW() AS fecha');

        res.json({
            mensaje: 'Conexión con PostgreSQL exitosa',
            fecha: resultado.rows[0].fecha
        });
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error.message);
        res.status(500).json({
            mensaje: 'No se pudo conectar con la base de datos'
        });
    }
});

app.use('/api/productos', require('../../../Backend/routes/productos'));
app.use('/api/pedidos', require('../../../Backend/routes/pedidos'));
app.use('/api/auth', require('../../../Backend/routes/auth'));

module.exports.handler = serverless(app);
