import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been successful.');
    })
    .catch((err) => {
        console.error('Failed to connect to database:', err);
    });

app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
