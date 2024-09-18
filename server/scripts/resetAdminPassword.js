const bcrypt = require('bcryptjs');  // 修改这行
const db = require('../database/db');  // 确保这个路径是正确的
const User = require('../models/User');  // 添加这行

async function resetAdminPassword() {
  const newPassword = 'newAdminPassword'; // 设置新的管理员密码
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await User.updateUser(1, { password: hashedPassword });  // 假设管理员的 ID 是 1
    console.log('Admin password has been reset.');
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await db.close();  // 确保关闭数据库连接
  }
}

resetAdminPassword().catch(console.error);