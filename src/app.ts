import express, { Router } from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler } from './middlewares/errorHandler';

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

//set routes
const apiRouter = Router();

apiRouter.use(authRoutes);
apiRouter.use(uploadRoutes);

app.use('/', apiRouter);


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;
