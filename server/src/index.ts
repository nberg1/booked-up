import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import bookRoutes from './routes/books';
import chatgptRoute from './routes/chatgpt';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chatgpt', chatgptRoute);


// Serve static files from the React app's build directory
const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

// Catchall route: for any request that doesn't match an API route,
// send back the React index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Export the app for testing
export default app;