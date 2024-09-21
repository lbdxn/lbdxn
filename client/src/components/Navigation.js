import React from 'react';
import { Link, useHistory } from 'react-router-dom';

function Navigation() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">仪表板</Link></li>
        <li><Link to="/data-form">数据表单</Link></li>
        <li><Link to="/reports">报告</Link></li>
        <li><button onClick={handleLogout}>登出</button></li>
      </ul>
    </nav>
  );
}

export default Navigation;