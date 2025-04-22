
import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import userRouter from './routes/user.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(arcjetMiddleware);


// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Error Handling Middleware
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Hello, Welcome to FemoPay API!');
});

// Catch-all route handler for unknown routes
app.all('*', (req, res) => {
  res.status(404).json({
    message: `Invalid route: ${req.originalUrl}`,
  });
});

// ✅ Connect to MongoDB first, then start the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀Server running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); // Exit if DB connection fails
  });

export default app;
