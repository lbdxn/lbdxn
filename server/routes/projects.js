const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// 创建新项目
router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), projectController.createProject);

// 获取所有项目
router.get('/', authenticateToken, projectController.getAllProjects);

// 获取特定项目
router.get('/:id', authenticateToken, projectController.getProject);

// 更新项目
router.put('/:id', authenticateToken, authorizeRole(['admin', 'manager']), projectController.updateProject);

// 删除项目
router.delete('/:id', authenticateToken, authorizeRole(['admin']), projectController.deleteProject);

module.exports = router;