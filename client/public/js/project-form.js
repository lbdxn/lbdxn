import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';

console.log('project-form.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('project-form.js DOMContentLoaded event fired');
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    console.log('projectId:', projectId);

    if (projectId) {
        loadProjectData(projectId);
    }
});

async function loadProjectData(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const project = await response.json();
        fillFormWithProjectData(project);
    } catch (error) {
        console.error('Error loading project data:', error);
        alert('加载项目数据时出错，请稍后再试。');
    }
}

function fillFormWithProjectData(project) {
    const form = document.getElementById('projectForm');
    Object.keys(project).forEach(key => {
        const field = form.elements[key];
        if (field) {
            field.value = project[key];
            if (project[key]) {
                field.parentNode.classList.add('focused');
            }
        }
    });
    disableFormEditing();
}

function saveProject() {
    return new Promise((resolve, reject) => {
        const form = document.getElementById('projectForm');
        const formData = new FormData(form);
        const projectData = Object.fromEntries(formData.entries());
        
        const url = projectData.id ? `/api/projects/${projectData.id}` : '/api/projects';
        const method = projectData.id ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(projectData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(savedProject => {
            resolve(savedProject);
        })
        .catch(error => {
            console.error('Error saving project:', error);
            reject(new Error('保存项目时出错，请稍后再试。'));
        });
    });
}

function enableFormEditing() {
    const form = document.getElementById('projectForm');
    Array.from(form.elements).forEach(element => {
        element.disabled = false;
    });
}

function disableFormEditing() {
    const form = document.getElementById('projectForm');
    Array.from(form.elements).forEach(element => {
        element.disabled = true;
    });
}

// 可以添加一个函数来显示/隐藏不同的表单部分
function showSection(sectionName) {
    // 隐藏所有部分
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => section.style.display = 'none');

    // 显示选中的部分
    const selectedSection = document.querySelector(`.form-section[data-section="${sectionName}"]`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleFormSubmit);
    }

    // 移除原有的提交按钮
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.remove();
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const projectData = Object.fromEntries(formData.entries());
    
    try {
        if (projectData.projectId) {
            // 更新现有项目
            await apiRequest(API_ROUTES.PROJECT(projectData.projectId), {
                method: 'PUT',
                body: JSON.stringify(projectData)
            });
        } else {
            // 添加新项目
            await apiRequest(API_ROUTES.PROJECTS, {
                method: 'POST',
                body: JSON.stringify(projectData)
            });
        }
        // 重定向到项目列表页面
        window.location.href = 'index.html';
    } catch (error) {
        console.error('保存项目时出错:', error);
        alert('保存项目时出现错误，请稍后再试。');
    }
}

export function uploadFile(fieldName) {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.click();

    fileInput.onchange = function() {
        const file = fileInput.files[0];
        if (file) {
            // 这里应该实现文件上传到服务器的逻辑
            // 例如使用 fetch API 或 XMLHttpRequest
            console.log(`上传文件: ${file.name} 到字段: ${fieldName}`);
            // 上传成功后，可以更新相应的输入框显示文件名
            document.querySelector(`input[name="${fieldName}"]`).value = file.name;
        }
        document.body.removeChild(fileInput);
    };
}

export function downloadFile(fieldName) {
    // 这里应该实现从服务器下载文件的逻辑
    // 例如使用 fetch API 获取文件并创建下载链接
    console.log(`下载字段 ${fieldName} 的文件`);
    alert('文件下载功能需要后端支持，目前仅作演示。');
}

export function deleteFile(fieldName) {
    const input = document.querySelector(`input[name="${fieldName}"]`);
    if (input.value) {
        if (confirm('确定要删除这个文件吗？')) {
            // 这里应该实现从服务器删除文件的逻辑
            console.log(`删除字段 ${fieldName} 的文件`);
            input.value = '';
            alert('文件已删除。');
        }
    } else {
        alert('没有文件可删除。');
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