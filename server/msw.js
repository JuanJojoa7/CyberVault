// server.js
import { setupWorker, rest } from 'https://unpkg.com/msw@0.43.0/lib/index.mjs';

// Define los manejadores de solicitudes
const handlers = [
    rest.post('/api/admin', (req, res, ctx) => {
        const { email, password } = req.body;

        // Simula la validación de las credenciales
        if (email === 'admin@gmail.com' && password === 'admin123') {
            return res(
                ctx.json({ success: true })
            );
        } else {
            return res(
                ctx.status(401),
                ctx.json({ success: false, message: 'Invalid email or password' })
            );
        }
    }),

    // Puedes agregar más rutas aquí según sea necesario
];

// Configura el Service Worker
const worker = setupWorker(...handlers);
worker.start();
