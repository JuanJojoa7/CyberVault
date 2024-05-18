const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client')));

// Ruta para autenticación de administrador
app.post('/api/admin', (req, res) => {
  const { email, password } = req.body;

  // Simula la validación de las credenciales
  if (email === 'admin@gmail.com' && password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Ruta para obtener productos
app.get('/api/products', (req, res) => {
  // Aquí puedes agregar lógica para cargar los productos desde un archivo JSON o una base de datos
  const products = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
    { id: 3, name: 'Product 3', price: 30 }
  ];
  res.json(products);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
