const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors());

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

// Directorio donde se encuentra el archivo products.json
const productsDir = path.join(__dirname, 'static');

// Ruta para obtener productos
app.get('/api/products', (req, res) => {
  // Ruta completa al archivo JSON de productos
  const productsFilePath = path.join(productsDir, 'products.json');

  // Lee el archivo JSON de productos
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de productos:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (error) {
      console.error('Error al analizar el archivo JSON de productos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
