const db = require('../database/db');

class Project {
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date TEXT,
        end_date TEXT,
        status TEXT,
        manager_id INTEGER,
        FOREIGN KEY (manager_id) REFERENCES users(id)
      )
    `;
    try {
      await db.runAsync(sql);
      console.log('项目表创建成功或已存在');
    } catch (error) {
      console.error('创建项目表时出错:', error);
      throw error;
    }
  }

  static async create(projectData) {
    const { name, description, start_date, end_date, status, manager_id } = projectData;
    const sql = `INSERT INTO projects (name, description, start_date, end_date, status, manager_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    return db.runAsync(sql, [name, description, start_date, end_date, status, manager_id]);
  }

  static async findById(id) {
    const sql = 'SELECT * FROM projects WHERE id = ?';
    const rows = await db.queryAsync(sql, [id]);
    return rows[0];
  }

  static async findAll() {
    const sql = 'SELECT * FROM projects';
    return db.queryAsync(sql);
  }

  static async update(id, updates) {
    const allowedUpdates = ['name', 'description', 'start_date', 'end_date', 'status', 'manager_id'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
      .map(key => `${key} = ?`)
      .join(', ');

    const updateValues = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key) && updates[key] !== undefined)
      .map(key => updates[key]);

    updateValues.push(id);

    const sql = `UPDATE projects SET ${updateFields} WHERE id = ?`;
    return db.runAsync(sql, updateValues);
  }

  static async delete(id) {
    const sql = 'DELETE FROM projects WHERE id = ?';
    return db.runAsync(sql, [id]);
  }
}

module.exports = Project;