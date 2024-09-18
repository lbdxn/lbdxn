import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';
import { TokenService } from './token.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        await performLogin(username, password);
    });

    async function performLogin(username, password) {
        try {
            console.log('Attempting login for:', username);
            const data = await apiRequest(API_ROUTES.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            console.log('Login response:', data);

            if (data.accessToken && data.refreshToken) {
                messageElement.textContent = '登录成功！';
                TokenService.setToken(data.accessToken);
                TokenService.setRefreshToken(data.refreshToken);
                console.log('Tokens stored:', 
                    'Access Token:', TokenService.getToken(), 
                    'Refresh Token:', TokenService.getRefreshToken()
                );

                // 登录成功后重定向到项目列表页面
                window.location.href = '/projects.html';
            } else {
                throw new Error('登录失败：未收到 token');
            }
        } catch (error) {
            console.error('登录出错:', error);
            messageElement.textContent = '登录失败，请检查用户名和密码。';
        }
    }
});