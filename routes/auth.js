const express = require('express');
const router = express.Router();

// Datos en memoria (reemplazar con base de datos en producción)
let usuarios = []; // { username, password, tipo: 'admin' | 'cliente' }

// Ruta para iniciar sesión (POST /auth/login)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Buscar el usuario en el array de usuarios
  const usuario = usuarios.find(u => u.username === username && u.password === password);

  if (usuario) {
    // Autenticación exitosa
    res.json({ success: true, message: 'Inicio de sesión exitoso', usuario });
    // En una implementación real, generarías un token JWT y lo enviarías al cliente
  } else {
    // Autenticación fallida
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

// Ruta para registrar un nuevo usuario (POST /auth/registro)
router.post('/registro', (req, res) => {
  const { username, password, tipo } = req.body;

  // Validación básica de datos (agregar más validaciones en una aplicación real)
  if (!username || !password || !tipo) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Verificar si el usuario ya existe
  const usuarioExistente = usuarios.find(u => u.username === username);
  if (usuarioExistente) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  // Crear nuevo usuario y agregarlo al array
  const nuevoUsuario = { username, password, tipo };
  usuarios.push(nuevoUsuario);

  res.json({ success: true, message: 'Usuario registrado', usuario: nuevoUsuario });
});

module.exports = router;
