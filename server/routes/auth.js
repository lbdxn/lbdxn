const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  updateUser, 
  getUser, 
  updateUserRole, 
  refreshToken 
} = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const db = require('../database/db');  // 添加这行

// 确保这行存在
router.post('/register', register);

// 修改这一行
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// 修改这行，允许用户更新自己的信息
router.put('/user/:userId', authenticateToken, updateUser);

// 添加这个新的路由
router.get('/user/:userId', authenticateToken, (req, res, next) => {
  console.log('User from token:', req.user);
  next();
}, getUser);

// 添加新的路由
router.put('/user/:userId/role', authenticateToken, authorizeRole(['admin']), updateUserRole);

// 修改临时路由来查看用户数据，添加身份验证和授权
router.get('/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await db.query('SELECT id, username, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message });
  }
});

// 添加刷新 token 的路由
router.post('/refresh-token', refreshToken);

module.exports = router;