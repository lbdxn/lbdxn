import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';

console.log('project-form.js loaded');

let isNewProject = true; // 标记是否为新项目
let currentProjectId = null; // 当前项目的ID

document.addEventListener('DOMContentLoaded', function() { // 当文档加载完成后执行
    const urlParams = new URLSearchParams(window.location.search); // 获取URL参数
    const projectId = urlParams.get('id'); // 获取项目ID

    if (projectId) { // 如果存在项目ID
        isNewProject = false; // 设置为非新项目
        currentProjectId = projectId; // 保存当前项目ID
        loadProjectData(projectId); // 加载项目数据
        disableForm(); // 禁用表单
        document.querySelector('.btn-edit').style.display = 'inline-block'; // 显示“修改”按钮
        document.querySelector('.btn-save').style.display = 'none'; // 隐藏“保存”按钮
    } else { // 如果不存在项目ID
        document.querySelector('.btn-edit').style.display = 'none'; // 隐藏“修改”按钮
        document.querySelector('.btn-save').style.display = 'inline-block'; // 显示“保存”按钮
    }
});

function loadProjectData(projectId) { // 加载项目数据的函数
    const projects = JSON.parse(localStorage.getItem('projects')) || []; // 从本地存储获取项目数据
    const projectData = projects.find(project => project.projectId === projectId); // 查找对应的项目数据

    if (projectData) { // 如果找到项目数据
        Object.keys(projectData).forEach(key => { // 遍历项目数据的每个键
            const element = document.querySelector(`[name="${key}"]`); // 获取对应的表单元素
            if (element) { // 如果元素存在
                if (element.type === 'date') {
                    element.value = projectData[key].split('T')[0]; // 处理日期格式
                } else {
                    element.value = projectData[key];
                }
            }
        });
    } else { // 如果未找到项目数据
        alert('未找到项目数据'); // 提示未找到数据
    }
}

function saveProjectData() { // 保存项目数据的函数
    const formData = new FormData(document.getElementById('projectForm')); // 获取表单数据
    const projectData = Object.fromEntries(formData.entries()); // 将表单数据转换为对象

    // 检查必填字段
    const requiredFields = ['projectName', 'outsourcingUnitName', 'performanceBond']; // 必填字段
    const missingFields = requiredFields.filter(field => !projectData[field]); // 检查缺失的必填字段

    if (missingFields.length > 0) { // 如果有缺失的字段
        alert(`请填写以下必填字段：${missingFields.join(', ')}`); // 提示用户填写必填字段
        return; // 退出函数
    }

    if (isNewProject) { // 如果是新项目
        projectData.projectId = Date.now().toString(); // 生成新项目ID
    } else { // 如果不是新项目
        projectData.projectId = currentProjectId; // 使用当前项目ID
    }

    // 保存所有表单字段
    const allInputs = document.querySelectorAll('#projectForm input, #projectForm select, #projectForm textarea');
    allInputs.forEach(input => {
        projectData[input.name] = input.value;
    });

    // 保存数据到 localStorage
    let projects = JSON.parse(localStorage.getItem('projects')) || []; // 从本地存储获取项目数据
    if (!isNewProject) {
        projects = projects.filter(p => p.projectId !== currentProjectId); // 移除旧数据
    }
    projects.unshift(projectData); // 添加项目数据到数组开头
    localStorage.setItem('projects', JSON.stringify(projects)); // 保存数据到本地存储

    alert('保存成功');
    
    // 向父窗口发送消息
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'projectUpdated', data: projectData }, '*');
    }
    
    window.close(); // 关闭当前窗口
}

function disableForm() { // 禁用表单的函数
    const inputs = document.querySelectorAll('#projectForm input, #projectForm select, #projectForm textarea'); // 获取所有输入元素
    inputs.forEach(input => input.disabled = true); // 禁用每个输入元素
}

function enableEdit() { // 启用编辑的函数
    const inputs = document.querySelectorAll('#projectForm input, #projectForm select, #projectForm textarea'); // 获取所有输入元素
    inputs.forEach(input => input.disabled = false); // 启用每个输入元素
    document.querySelector('.btn-edit').style.display = 'none'; // 隐藏“修改”按钮
    document.querySelector('.btn-save').style.display = 'inline-block'; // 显示“保存”按钮
}

// 确保saveProjectData可以被调用
window.saveProjectData = saveProjectData; 
window.enableEdit = enableEdit; // 确保enableEdit可以被调用

function uploadFile(fieldName) {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            const fileData = event.target.result;
            const fileName = file.name;
            document.querySelector(`[name="${fieldName}"]`).value = fileName;
            // 保存文件数据到 localStorage
            localStorage.setItem(`${currentProjectId}_${fieldName}`, JSON.stringify({name: fileName, data: fileData}));
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function downloadFile(fieldName) {
    const fileInfo = JSON.parse(localStorage.getItem(`${currentProjectId}_${fieldName}`));
    if (fileInfo) {
        const link = document.createElement('a');
        link.href = fileInfo.data;
        link.download = fileInfo.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('没有找到文件');
    }
}

function deleteFile(fieldName) {
    if (confirm('确定要删除这个文件吗？')) {
        localStorage.removeItem(`${currentProjectId}_${fieldName}`);
        document.querySelector(`[name="${fieldName}"]`).value = '';
    }
}

// 将这些函数添加到 window 对象，使其可以在 HTML 中调用
window.uploadFile = uploadFile;
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;