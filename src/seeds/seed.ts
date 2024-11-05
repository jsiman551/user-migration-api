// src/seeds/seed.ts
import sequelize from '../config/database';
import User from '../models/user';

const seedAdminUser = async () => {
    try {
        // Sincroniza los modelos con la base de datos
        await sequelize.sync({ force: true }); // ¡Ten cuidado con esto en producción!

        // Crear el usuario admin
        const adminUser = await User.create({
            name: 'admin',
            email: 'admin@example.com', // Cambia esto si es necesario
            age: 30, // Puedes omitir esto si quieres que sea opcional
            role: 'admin',
            password: '123456', // Agrega la contraseña aquí
        });

        console.log('Usuario admin creado:', adminUser.toJSON());
    } catch (error) {
        console.error('Error al crear el usuario admin:', error);
    } finally {
        await sequelize.close(); // Cierra la conexión a la base de datos
    }
};

seedAdminUser();
