import sequelize from '../config/database';
import User from '../models/user';

const seedAdminUser = async () => {
    try {
        await sequelize.sync();
        await User.create({
            name: 'admin',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin',
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

seedAdminUser();
