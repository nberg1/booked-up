import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
// import bookRoutes from './routes/books';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
// app.use('/api/books', bookRoutes);

// Simple test route
app.get('/', (req: Request, res: Response) => {
    res.send('Booked Up Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});