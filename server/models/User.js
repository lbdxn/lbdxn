const db = require('../database/db');
const bcrypt = require('bcryptjs');

class User {
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `;
    try {
      await db.runAsync(sql);  // 改为 runAsync
      console.log('用户表创建成功或已存在');
    } catch (error) {
      console.error('创建用户表时出错:', error);
      throw error;
    }
  }

  static async create(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    return db.runAsync(sql, [username, hashedPassword, role]);  // 改为 runAsync
  }

  static async createUser(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    return db.runAsync(sql, [username, hashedPassword, role]);  // 改为 runAsync
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const rows = await db.query(query, [username]);
    return rows[0];
  }

  static async verifyPassword(user, password) {
    console.log('Verifying password for user:', user); // 添加这行
    return bcrypt.compare(password, user.password);
  }

  static async updateUser(userId, updates) {
    const allowedUpdates = ['username', 'password', 'role'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
      .map(key => `${key} = ?`)
      .join(', ');

    const updateValues = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
      .map(key => updates[key]);

    updateValues.push(userId);

    const sql = `UPDATE users SET ${updateFields} WHERE id = ?`;
    return db.runAsync(sql, updateValues);  // 改为 runAsync
  }

  static async findById(userId) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const rows = await db.queryAsync(sql, [userId]);
    return rows[0];
  }

  static async updateRole(userId, newRole) {
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    return db.runAsync(sql, [newRole, userId]);  // 改为 runAsync
  }
}

module.exports = User;