import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageElement = document.getElementById('message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        await performRegister(username, password, role);
    });

    async function performRegister(username, password, role) {
        try {
            console.log('Attempting registration for:', username);
            const data = await apiRequest(API_ROUTES.REGISTER, {
                method: 'POST',
                body: JSON.stringify({ username, password, role }),
            });

            console.log('Registration response:', data);

            if (data.message === '用户创建成功') {
                messageElement.textContent = '注册成功！请返回登录页面进行登录。';
                registerForm.reset();
            } else {
                throw new Error(data.message || '注册失败');
            }
        } catch (error) {
            console.error('注册出错:', error);
            messageElement.textContent = error.message || '注册失败，请稍后再试。';
        }
    }
});