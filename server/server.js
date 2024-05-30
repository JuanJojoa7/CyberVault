const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const User = require('./user');

const app = express();
const PORT = process.env.PORT || 3000;

let users = [];

users.push(User("Admin", "admin@gmail.com", "admin123", true));
users.push(User("Mock Client", "user@gmail.com", "admin123", false));

let admin = users[0];

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client')));

// Ruta para autenticación de administrador
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  let authenticated = false;

  for (let user of users) {
    if (email === user.email && password === user.password) {
      res.json({ success: true });
      authenticated = true;

      if (user == admin) {
        admin.setIsOnline(true);
      }

      break;
    }
  }

  if (!authenticated) {
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
