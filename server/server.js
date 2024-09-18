require('dotenv').config();
const util = require('util');
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const db = require('./database/db');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');
const User = require('./models/User');
const projectRoutes = require('./routes/projects');
const Project = require('./models/Project');
const cors = require('cors');

console.log("当前工作目录:", process.cwd());
console.log("express 模块加载成功");

const app = express();

// 确保这行在其他路由之前
app.use(express.json());

// 在其他中间件之后添加这行
app.use(express.static(path.join(__dirname, '../client/public')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

// 添加一个简单的根路由，用于测试
app.get('/', (req, res) => {
  res.json({ message: '服务器正在运行' });
});

// 修改数据库检查路由
app.get('/api/check-db', async (req, res) => {
  try {
    const result = await db.queryAsync('SELECT name FROM sqlite_master WHERE type="table" AND name="users"');
    res.json({ tableExists: result.length > 0 });
  } catch (error) {
    console.error('检查数据库时出错:', error);
    res.status(500).json({ error: '检查数据库时出错' });
  }
});

// HTTPS服务器选项
const httpsOptions = {
  key: fs.readFileSync('./config/key.pem'),
  cert: fs.readFileSync('./config/cert.pem')
};

// 初始化数据库和启动服务器
async function initializeAndStartServer() {
  try {
    await db.testConnection();
    // 手动创建用户表
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `);
    console.log('用户表创建成功或已存在');

    // 创建用户表（使用 User 模型）
    await User.createTable();
    console.log('用户表创建成功');

    // 创建项目表
    await Project.createTable();
    console.log('项目表创建成功');

    // 启动服务器
    const PORT = process.env.PORT || 3000;
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`服务器运行在 https://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('初始化数据库或启动服务器时出错:', error);
  }
}

// 运行初始化和启动函数
initializeAndStartServer();

// 在其他路由之后添加这个路由处理程序
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// 添加路由来处理登录页面
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/login.html'));
});

process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

// 临时添加错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error('JWT_SECRET or REFRESH_TOKEN_SECRET is not set in .env file');
  process.exit(1);
}

app.use(cors());