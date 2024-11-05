import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been successful.');
    })
    .catch((err) => {
        console.error('Failed to connect to database:', err);
    });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
