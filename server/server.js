import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import personRoutes from './routes/personRoutes.js';
import debtorRoutes from './routes/debtorRoutes.js';
import landRoutes from './routes/landRoutes.js';
import buildRoutes from './routes/buildRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
import finalDecisionRoutes from './routes/finalDecisionRoutes.js';

dotenv.config();

const app = express();

// 調試中間件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// 基本路由 - 用於調試
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({
    message: 'API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get('/debug', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
    emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
    emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
    clientUrl: process.env.CLIENT_URL ? 'Set' : 'Not set',
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });
});

// 資料庫連接
try {
  await connectDB();
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection error:', error);
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api', personRoutes);
app.use('/api', debtorRoutes);
app.use('/api', landRoutes);
app.use('/api', buildRoutes);
app.use('/api', surveyRoutes);
app.use('/api', finalDecisionRoutes);

// 404 處理
app.use('*', (req, res) => {
  console.log('404 Route not found:', req.originalUrl);
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : '🥞',
    timestamp: new Date().toISOString(),
  });
});

// 在所有環境下啟動服務器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
