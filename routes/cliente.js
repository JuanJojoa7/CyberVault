// Funciones de utilidad (API_URL y fetchAPI)
// ... (igual que en el ejemplo anterior)

// Variables globales para almacenar datos
let productos = [];
let carrito = [];
let usuarioActual = null; // { username, tipo: 'admin' | 'cliente' }

// Obtener elementos del DOM
const contenidoPrincipal = document.getElementById('contenidoPrincipal');
const loginLink = document.getElementById('loginLink');
const registroLink = document.getElementById('registroLink');
const productosLink = document.getElementById('productosLink');
const carritoLink = document.getElementById('carritoLink');

// Funciones para autenticación
async function iniciarSesion(username, password) {
  const data = { username, password };
  try {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.success) {
      usuarioActual = response.usuario;
      localStorage.setItem('usuario', JSON.stringify(usuarioActual)); // Guardar en localStorage
      mostrarMensajeExito('Inicio de sesión exitoso');
      actualizarVistas(); // Actualizar la vista según el tipo de usuario
    } else {
      mostrarError(response.message);
    }
  } catch (error) {
    mostrarError('Error al iniciar sesión');
  }
}

async function registrarUsuario(username, password, tipo) {
  // ... (similar a iniciarSesion, pero con POST a /auth/registro)
}

// Funciones para productos
async function obtenerProductos() {
  try {
    const data = await fetchAPI('/cliente/productos');
    productos = data;
    mostrarProductos();
  } catch (error) {
    mostrarError('Error al obtener productos');
  }
}

// Funciones para carrito y compras
async function agregarAlCarrito(productoId) {
  // ... (enviar POST a /cliente/carrito con productoId y cantidad)
}

async function realizarCompra() {
  // ... (enviar POST a /cliente/compra con los datos del carrito)
}

// Funciones para renderizar vistas
function mostrarProductos() {
  contenidoPrincipal.innerHTML = `
    <h2>Productos</h2>
    <ul>
      ${productos.map(producto => `
        <li>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <p>Precio: $${producto.precio}</p>
          <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        </li>
      `).join('')}
    </ul>
  `;
}

function mostrarCarrito() {
  // ... (obtener el carrito del servidor y generar el HTML)
}

function mostrarFormularioLogin() {
  // ... (generar el HTML del formulario de inicio de sesión)
}

function mostrarFormularioRegistro() {
  // ... (generar el HTML del formulario de registro)
}

function mostrarVistaAdmin() {
  // ... (generar el HTML de la vista de administración)
}

// Función para actualizar las vistas según el usuario actual
function actualizarVistas() {
  if (usuarioActual) {
    loginLink.style.display = 'none';
    registroLink.style.display = 'none';
    carritoLink.style.display = 'block';
    if (usuarioActual.tipo === 'admin') {
      mostrarVistaAdmin();
    } else {
      mostrarProductos();
    }
  } else {
    loginLink.style.display = 'block';
    registroLink.style.display = 'block';
    carritoLink.style.display = 'none';
    mostrarFormularioLogin();
  }
}

// Manejo de eventos (clicks en enlaces, envíos de formularios)
// ... (igual que en el ejemplo anterior, pero llamar a actualizarVistas() después de iniciar sesión o registrarse)

// Inicialización
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
if (usuarioGuardado) {
  usuarioActual = usuarioGuardado;
}
actualizarVistas();
obtenerProductos();
