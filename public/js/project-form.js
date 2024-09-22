import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';

console.log('project-form.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const mode = urlParams.get('mode');

    if (projectId) {
        try {
            const projectData = loadProjectData(projectId);
            fillFormWithProjectData(projectData);
            if (mode === 'view') {
                disableFormInputs();
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            alert('无法加载项目数据');
        }
    } else {
        // 新建项目模式
        const projectNameInput = document.querySelector('input[name="projectName"]');
        projectNameInput.addEventListener('blur', checkProjectNameExists);
    }
});

function loadProjectData(projectId) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects.find(p => p.projectId === projectId);
    if (project) {
        return project;
    } else {
        throw new Error('Project not found');
    }
}

function fillFormWithProjectData(data) {
    const form = document.getElementById('projectForm');
    for (const [key, value] of Object.entries(data)) {
        const field = form.elements[key];
        if (field) {
            field.value = value;
        }
    }
}

function disableFormInputs() {
    const form = document.getElementById('projectForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.setAttribute('disabled', true);
    });
}

export function uploadFile(fieldName) {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 模拟文件上传，实际上只是将文件名存储在输入框中
        const fileName = file.name;
        document.querySelector(`input[name="${fieldName}"]`).value = fileName;
        alert('文件上传成功（模拟）');
    };
    input.click();
}

export function downloadFile(fieldName) {
    const fileName = document.querySelector(`input[name="${fieldName}"]`).value;
    if (!fileName) {
        alert('没有可下载的文件');
        return;
    }

    // 模拟文件下载
    alert(`模拟下载文件：${fileName}`);
}

export function deleteFile(fieldName) {
    const fileName = document.querySelector(`input[name="${fieldName}"]`).value;
    if (!fileName) {
        alert('没有可删除的文件');
        return;
    }

    if (confirm('确定要删除这个文件吗？')) {
        // 模拟文件删除
        document.querySelector(`input[name="${fieldName}"]`).value = '';
        alert('文件已成功删除（模拟）');
    }
}

export async function editSection(sectionName) {
    // 这里可以添加编辑逻辑，例如启用表单字段
    console.log(`编辑 ${sectionName} 部分`);
    // 实际应用中，您可能需要启用相应部分的输入字段
}

export async function saveSection(sectionName) {
    // 这里可以添加保存逻辑，例如禁用表单字段并保存数据
    console.log(`保存 ${sectionName} 部分`);
    try {
        const formData = new FormData(document.getElementById('projectForm'));
        const projectData = Object.fromEntries(formData.entries());
        const projectId = projectData.projectId;

        await apiRequest(API_ROUTES.PROJECT(projectId), {
            method: 'PATCH',
            body: JSON.stringify({ [sectionName]: projectData })
        });

        alert(`${sectionName} 部分保存成功`);
    } catch (error) {
        console.error(`保存 ${sectionName} 部分时出错:`, error);
        alert(`保存 ${sectionName} 部分时出现错误，请稍后再试。`);
    }
}

// 修改保存项目数据的函数，使用 localStorage
export function saveProjectData() {
    const form = document.getElementById('projectForm');
    const formData = new FormData(form);
    const projectData = Object.fromEntries(formData.entries());
    
    // 检查必填字段
    if (!projectData.projectName || !projectData.outsourcingUnitName || !projectData.projectStatus) {
        alert('请填写必填字段');
        return;
    }

    // 再次检查项目名称是否已存在
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const existingProject = projects.find(p => p.projectName === projectData.projectName && p.projectId !== projectData.projectId);
    if (existingProject) {
        alert('项目名称已存在，请重新输入');
        return;
    }

    if (!projectData.projectId) {
        projectData.projectId = Date.now().toString();
    }

    const existingIndex = projects.findIndex(p => p.projectId === projectData.projectId);
    if (existingIndex > -1) {
        projects[existingIndex] = projectData;
    } else {
        projects.push(projectData);
    }
    localStorage.setItem('projects', JSON.stringify(projects));

    alert('项目数据已保存到本地存储');
    disableForm();
    // window.location.href = 'index.html'; // 注释掉这行，不自动跳转
}

window.saveProjectData = saveProjectData;

export function enableEdit() {
    const form = document.getElementById('projectForm');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach(input => {
        input.removeAttribute('disabled');
        input.removeAttribute('readonly');
    });
    document.querySelector('.global-buttons .edit').style.display = 'none';
    document.querySelector('.global-buttons .save').style.display = 'inline-block';
}

export function disableForm() {
    const form = document.getElementById('projectForm');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    inputs.forEach(input => {
        input.setAttribute('disabled', 'disabled');
        input.setAttribute('readonly', 'readonly');
    });
    document.querySelector('.global-buttons .edit').style.display = 'inline-block';
    document.querySelector('.global-buttons .save').style.display = 'none';
}

window.enableEdit = enableEdit;
window.disableForm = disableForm;

function checkProjectNameExists() {
    const projectName = this.value.trim();
    if (projectName) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const existingProject = projects.find(p => p.projectName === projectName);
        if (existingProject) {
            alert('项目名称已存在，请重新输入');
            this.value = ''; // 清空输入
            this.focus(); // 重新聚焦到输入框
        }
    }
}