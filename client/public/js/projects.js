import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';
import { TokenService } from './token.service.js';

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});

async function loadProjects() {
    try {
        const projects = await apiRequest(API_ROUTES.PROJECTS);
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
            // Token 可能已过期，重定向到登录页面
            window.location.href = '/login.html';
        } else {
            alert('加载项目列表时出错，请稍后再试。');
        }
    }
}

function displayProjects(projects) {
    const projectList = document.querySelector('#projectsTable tbody');
    projectList.innerHTML = '';

    projects.forEach((project, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="project-form.html?id=${project.id}">${project.projectName}</a></td>
            <td>${project.outsourcingUnitName || '未指定'}</td>
            <td>${project.projectStatus}</td>
        `;
        projectList.appendChild(row);
    });
}

function logout() {
    TokenService.removeToken();
    TokenService.removeRefreshToken(); // 添加这行
    window.location.href = '/login.html';
}