import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DataForm from './components/DataForm';
import Reports from './components/Reports';

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/data-form" component={DataForm} />
        <PrivateRoute path="/reports" component={Reports} />
      </Switch>
    </Router>
  );
}

export default App;