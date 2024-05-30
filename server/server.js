const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const User = require('./user');

const app = express();
const PORT = process.env.PORT || 3000;

// Directorio donde se encuentra el archivo products.json
const productsDir = path.join(__dirname, 'static');

let users = [];

users.push(new User("Admin", "admin@gmail.com", "admin123", true));
users.push(new User("Mock Client", "user@gmail.com", "user123", false));

let admin = users[0];
let loggedUser;

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client')));

// Ruta para autenticación del usuario
app.post('/api/login', (req, res) => {
  console.log("Login attempted");
  const { email, password } = req.body;
  let authenticated = false;

  for (let user of users) {
    if (email === user.email && password === user.password) {
      res.json({ success: true });
      authenticated = true;

      if (authenticated && user === admin) {
        admin.setIsOnline(true);
      } else if (authenticated) {
        loggedUser = user;
        loggedUser.setIsOnline(true);
      }

      break;
    }
  }

  if (!authenticated) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});


app.get('/api/whos_logged', (req, res) => {
  try {
    res.json(
      {
        success: true,
        isSomebodyLogged: typeof loggedUser !== 'undefined' && loggedUser !== null,
        isAdmin: admin.isOnline
      }
    );
  } catch (error) {
    console.error('Error al detectar usuarios loggeados');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

app.post('/api/logout', (req, res) => {
  loggedUser = null;

  res.status(200).send({ message: 'Logout successful' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
