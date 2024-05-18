const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Puerto configurable para despliegue

// Middleware
app.use(express.json()); // Permite analizar datos JSON en el cuerpo de las solicitudes
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

// Datos en memoria (reemplazar con base de datos en producción)
let productos = [];
let usuarios = []; // { username, password, tipo: 'admin' | 'cliente' }
let carritos = {}; // { usuarioId: [{ productoId, cantidad }] }
let compras = []; // { usuarioId, productos: [{ productoId, cantidad }], fecha }

// Rutas
const authRoutes = require('./routes/auth'); 
const adminRoutes = require('./routes/admin'); 
const clienteRoutes = require('./routes/cliente'); 

app.use('/auth', authRoutes); // Rutas de autenticación (login, registro)
app.use('/admin', adminRoutes); // Rutas de administrador (agregar productos, etc.)
app.use('/cliente', clienteRoutes); // Rutas de cliente (ver productos, carrito, compras)

// Manejo de errores (middleware de error)
app.use((err, req, res, next) => {
  console.error(err.stack); // Registrar el error en la consola
  res.status(500).json({ error: 'Algo salió mal!' }); // Enviar respuesta de error al cliente
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
