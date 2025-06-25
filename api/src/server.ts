import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API Running...');
});

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Tables synced'))
  .catch(err => console.error('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(Number(PORT), () => console.log(`Server running on port ${PORT}`));
