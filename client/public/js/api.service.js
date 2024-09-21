import { API_ROUTES } from './api.config.js';
import { TokenService } from './token.service.js';

async function refreshToken() {
  const refreshToken = TokenService.getRefreshToken();
  if (!refreshToken) {
    console.error('No refresh token found');
    TokenService.removeToken();
    TokenService.removeRefreshToken();
    window.location.href = '/login.html'; // 重定向到登录页面
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(API_ROUTES.REFRESH_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken } = await response.json();
    TokenService.setToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    TokenService.removeToken();
    TokenService.removeRefreshToken();
    window.location.href = '/login.html'; // 重定向到登录页面
    throw error;
  }
}

export async function apiRequest(url, options = {}) {
  console.log('Sending request to:', url);
  console.log('Request options:', options);
  let token = TokenService.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      token = await refreshToken();
      headers.Authorization = `Bearer ${token}`;
      response = await fetch(url, { ...options, headers });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export function setupTokenRefresh() {
  setInterval(async () => {
    try {
      await refreshToken();
      console.log('Token refreshed');
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }, 14 * 60 * 1000); // 每14分钟刷新一次
}