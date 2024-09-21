export const TokenService = {
  setToken(token) {
    try {
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },
  getToken() {
    return localStorage.getItem('token');
  },
  removeToken() {
    localStorage.removeItem('token');
  },
  setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  },
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },
  removeRefreshToken() {
    localStorage.removeItem('refreshToken');
  }
};