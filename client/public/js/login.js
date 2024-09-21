import { API_ROUTES } from './api.config.js';
import { apiRequest } from './api.service.js';
import { TokenService } from './token.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');
    const togglePasswordButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        await performLogin(username, password);
    });

    togglePasswordButton.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordButton.querySelector('i').classList.remove('fa-eye');
            togglePasswordButton.querySelector('i').classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            togglePasswordButton.querySelector('i').classList.remove('fa-eye-slash');
            togglePasswordButton.querySelector('i').classList.add('fa-eye');
        }
    });

    async function performLogin(username, password) {
        try {
            console.log('尝试登录用户:', username);
            const data = await apiRequest(API_ROUTES.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            console.log('登录响应:', data);

            if (data.accessToken && data.refreshToken) {
                messageElement.textContent = '登录成功！';
                TokenService.setToken(data.accessToken);
                TokenService.setRefreshToken(data.refreshToken);
                console.log('令牌已存储:', 
                    '访问令牌:', TokenService.getToken(), 
                    '刷新令牌:', TokenService.getRefreshToken()
                );

                console.log('正在跳转到 index.html');
                window.location.href = 'index.html';
            } else {
                throw new Error('登录失败：未收到令牌');
            }
        } catch (error) {
            console.error('登录出错:', error);
            messageElement.textContent = '登录失败，请检查用户名和密码。';
        }
    }
});