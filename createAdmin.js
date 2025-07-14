// This script creates the first admin user
// Run this once to create your admin account

import { connectDB } from './lib/config/db.js';
import Admin from './lib/models/AdminModel.js';

async function createAdmin() {
    try {
        await connectDB();
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('Admin already exists!');
            return;
        }
        
        // Create new admin
        const admin = await Admin.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123'
        });
        
        console.log('Admin created successfully:', {
            id: admin._id,
            username: admin.username,
            email: admin.email
        });
        
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

createAdmin();
