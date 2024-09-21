const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

async function getDbConnection() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

async function testConnection() {
  try {
    const db = await getDbConnection();
    await db.get('SELECT 1');
    console.log('Database connection successful');
    await db.close();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

module.exports = {
  async query(sql, params) {
    const db = await getDbConnection();
    try {
      return await db.all(sql, params);
    } finally {
      await db.close();
    }
  },
  async runAsync(sql, params) {
    const db = await getDbConnection();
    try {
      return await db.run(sql, params);
    } finally {
      await db.close();
    }
  },
  // 添加其他需要的数据库操作方法
  testConnection
};