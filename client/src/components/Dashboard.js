import React from 'react';
import Navigation from './Navigation';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <Navigation />
      <h1>欢迎，{user.username}!</h1>
      <p>您的角色是：{user.role}</p>
      {/* 这里可以添加更多仪表板内容 */}
    </div>
  );
}

export default Dashboard;