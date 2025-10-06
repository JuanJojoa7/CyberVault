const request = require('supertest');
const express = require('express');
const cors = require('cors');
const path = require('path');
const User = require('../server/user');

// Mock del servidor para testing
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    let users = [];
    users.push(new User("Admin", "admin@gmail.com", "admin123", true));
    users.push(new User("Mock Client", "user@gmail.com", "user123", false));

    // Endpoint de login para testing
    app.post('/api/login', (req, res) => {
        const { email, password } = req.body;
        let authenticated = false;

        for (let user of users) {
            if (email === user.email && password === user.password) {
                res.json({ success: true });
                return;
            }
        }
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    });

    // Endpoint de registro para testing
    app.post('/api/register', (req, res) => {
        const { name, email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const newUser = new User(name, email, password, false);
        users.push(newUser);
        res.json({ success: true, message: 'User registered successfully' });
    });

    return app;
};

describe('Server API Endpoints', () => {
    let app;

    beforeEach(() => {
        app = createTestApp();
    });

    describe('POST /api/login', () => {
        test('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'admin@gmail.com',
                    password: 'admin123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: 'wrong@email.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        test('should handle missing credentials', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({});

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/register', () => {
        test('should register new user successfully', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    name: 'New User',
                    email: 'newuser@example.com',
                    password: 'newpassword123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject duplicate email', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    name: 'Duplicate User',
                    email: 'admin@gmail.com', // Email already exists
                    password: 'password123'
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });
    });
});