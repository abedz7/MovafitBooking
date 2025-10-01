import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UsersRouter from './Users/Users.routes';

const uri = process.env.MONGODB_URI;
console.log("Mongo URI:", uri); // Debug: check if it's loaded

mongoose.connect(uri!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', UsersRouter);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Movafit Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
