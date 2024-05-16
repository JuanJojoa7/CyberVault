const express = require('express');
const router = express.Router();

// Middleware para verificar autenticación de administrador (ejemplo básico)
const verificarAdmin = (req, res, next) => {
  // En una implementación real, verificarías el token o la sesión del usuario
  if (req.headers.authorization === 'admin_token') { // Reemplazar con lógica real
    next();
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
};

// Ruta para agregar un nuevo producto (POST /admin/productos)
router.post('/productos', verificarAdmin, (req, res) => {
  const nuevoProducto = req.body;

  // Validación básica de datos (puedes agregar más validaciones)
  if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.descripcion || !nuevoProducto.cantidad) {
    return res.status(400).json({ error: 'Faltan datos del producto' });
  }

  // Asignar un ID al producto (puedes usar un contador o generar un UUID)
  nuevoProducto.id = productos.length + 1; 

  productos.push(nuevoProducto);
  res.json({ mensaje: 'Producto agregado', producto: nuevoProducto });
});

// Otras rutas para administradores (editar, eliminar productos, etc.)
// ...

module.exports = router; 
