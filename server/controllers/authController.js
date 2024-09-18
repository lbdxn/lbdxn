const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');  // 修改这行

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const loginAttempts = {};

exports.register = async (req, res, next) => {
  try {
    console.log('Registration attempt:', req.body);
    const { username, password, role } = req.body;
    
    // 验证角色
    const validRoles = ['user', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: '无效的角色' });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    await User.createUser(username, password, role);
    res.status(201).json({ message: '用户创建成功' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    const user = await User.findByUsername(username);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    console.log('Comparing passwords');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    console.log('Password is valid, generating tokens');
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful');
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

function incrementLoginAttempts(username) {
  if (!loginAttempts[username]) {
    loginAttempts[username] = { attempts: 1, lastAttempt: Date.now() };
  } else {
    loginAttempts[username].attempts++;
    loginAttempts[username].lastAttempt = Date.now();
  }
}

exports.logout = (req, res) => {
  // 客户端处理登出，服务器端不需要特殊处理
  res.json({ message: '登出成功' });
};

exports.updateUser = async (req, res, next) => {
  try {
    console.log('updateUser called, userId:', req.params.userId);
    console.log('Authenticated user:', req.user);
    
    const { userId } = req.params;
    const updates = req.body;
    
    // 检查用户是否在更新自己的信息或者是管理员
    if (req.user.id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限更新其他用户的信息' });
    }
    
    await User.updateUser(userId, updates);
    res.json({ message: '用户信息更新成功' });
  } catch (error) {
    console.error('Error in updateUser:', error);
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    console.log('getUser called, userId:', req.params.userId);
    console.log('Authenticated user:', req.user);
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    // 不返回密码
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error in getUser:', error);
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ message: '无效的角色' });
    }

    await User.updateRole(userId, role);
    res.json({ message: '用户角色更新成功' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: '刷新令牌不存在' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('刷新令牌错误:', error);
    res.status(403).json({ message: '无效的刷新令牌' });
  }
};

module.exports = {
  register: exports.register,
  login: exports.login,
  logout: exports.logout,
  updateUser: exports.updateUser,
  getUser: exports.getUser,
  updateUserRole: exports.updateUserRole,
  refreshToken: exports.refreshToken  // 确保这行存在
};