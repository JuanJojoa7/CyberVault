const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const User = require('./user');

const app = express();
const PORT = process.env.PORT || 3000;

// Directorio donde se encuentra el archivo products.json
const productsDir = path.join(__dirname, 'static');

const productsFilePath = path.join(productsDir, 'products.json');
let products = [];

// Leer productos del archivo JSON
fs.readFile(productsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo de productos:', err);
    return;
  }
  products = JSON.parse(data);
});

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
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ruta para autenticación del usuario
app.post('/api/login', (req, res) => {
  console.log("Login attempted");
  const { email, password } = req.body;
  let authenticated = false;

  for (let user of users) {
    if (email === user.email && password === user.password) {
      res.json({ success: true });
      authenticated = true;

      loggedUser = user;
      loggedUser.setIsOnline(true);

      break;
    }
  }

  if (!authenticated) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Ruta para registro del usuario
app.post('/api/register', (req, res) => {
  console.log("Registration attempted");
  const { fullname, email, password } = req.body;

  // Comprobar si el correo electrónico ya está en uso
  for (let user of users) {
    if (email === user.email) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }
  }

  // Crear el nuevo usuario
  const newUser = new User(fullname, email, password, true);

  // Añadir el nuevo usuario a la lista de usuarios
  users.push(newUser);

  // Enviar una respuesta de éxito
  res.json({ success: true });
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
  res.json(products);
});

app.post('/api/logout', (req, res) => {
  loggedUser.setIsOnline(false);
  loggedUser = null;
  res.status(200).send({ message: 'Logout successful' });
});

app.get('/api/get_user_history', (req, res) => {
  if (loggedUser !== null) {
    res.status(200).send({ history: loggedUser.history });
  } else {
    res.status(401).send({ error: 'No logged user', history: [] });
  }
});

// POST: Crear un nuevo producto
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);
  fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
    if (err) {
      console.error('Error al guardar el nuevo producto:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).send(newProduct);
    }
  });
});

// PUT: Actualizar un producto existente
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Product not found' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = updatedProduct;
  fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
    if (err) {
      console.error('Error al actualizar el producto:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.send(updatedProduct);
    }
  });
});

// DELETE: Eliminar un producto existente
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1);
  fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.send(deletedProduct);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});