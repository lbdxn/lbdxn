const API_BASE_URL = '/api';

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROJECTS: `${API_BASE_URL}/projects`,
  PROJECT: (id) => `${API_BASE_URL}/projects/${id}`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  // ... 其他路由
};