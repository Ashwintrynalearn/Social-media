import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();
const app = express();

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(5001, () => console.log('Server running on port 5001'));