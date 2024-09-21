const axios = require('axios');
const fs = require('fs');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});

axios.post('https://localhost:3000/api/auth/login', {
  username: 'testuser',
  password: 'testpassword'
}, {
  httpsAgent: agent
})
.then(response => {
  console.log('登录成功，JWT令牌：', response.data.token);
  fs.writeFileSync('token.txt', response.data.token);
})
.catch(error => {
  console.error('登录失败:', error.response ? error.response.data : error.message);
});