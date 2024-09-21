const Project = require('../models/Project');

// 创建新项目
exports.createProject = async (req, res, next) => {
  try {
    const projectData = req.body;
    const result = await Project.create(projectData);
    res.status(201).json({ message: '项目创建成功', projectId: result.id });
  } catch (error) {
    next(error);
  }
};

// 获取所有项目
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// 获取特定项目
exports.getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: '项目不存在' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// 更新项目
exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await Project.update(id, updates);
    res.json({ message: '项目更新成功' });
  } catch (error) {
    next(error);
  }
};

// 删除项目
exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Project.delete(id);
    res.json({ message: '项目删除成功' });
  } catch (error) {
    next(error);
  }
};