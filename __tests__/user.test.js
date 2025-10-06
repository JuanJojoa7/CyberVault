const User = require('../server/user');

describe('User Class', () => {
    test('should create a user with correct properties', () => {
        const user = new User('Test User', 'test@example.com', 'password123', false);
        
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
        expect(user.password).toBe('password123');
        expect(user.isAdmin).toBe(false);
    });

    test('should create an admin user', () => {
        const admin = new User('Admin User', 'admin@example.com', 'admin123', true);
        
        expect(admin.isAdmin).toBe(true);
    });

    test('should handle empty name', () => {
        const user = new User('', 'test@example.com', 'password123', false);
        
        expect(user.name).toBe('');
        expect(user.email).toBe('test@example.com');
    });
});