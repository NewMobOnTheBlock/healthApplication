import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';
import { AppContext } from './context';
import Dashboard from './Dashboard';
import CarbGraph from './Carbs';
import Analytics from './Analytics';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import UserInfo from './UserInfo';

function App() {
  const stored = JSON.parse(localStorage.getItem('auth'));
  const [auth, setAuth] = useState(stored || { isAuth: false, id: 0, goal: 0 });
  console.log('logged in:', auth.isAuth, 'id:', auth.id, 'goal:',auth.goal);

  function handleLogout() {
    setAuth({ isAuth: false, id: 0, goal: 0 });
    localStorage.clear()
  }

  useEffect(() => {
    if (auth.isAuth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    }
  }, [auth.isAuth])

  return (
  <AppContext.Provider value={{ auth, setAuth }}>
  <Router>
    <div>
      {auth.isAuth
        ? <>
          <Redirect to="/dashboard" />
          <nav className="sidebar">
            <UserInfo id={auth.id} />
            <Link to="/dashboard" className="sidebarlink">Dashboard</Link>
            <Link to="/analytics" className="sidebarlink">Analytics</Link>
            <Link to="/carbs" className="sidebarlink">CarbGraph</Link>
            <Link to="/">
              <NavItem onClick={handleLogout}>Logout</NavItem>
            </Link>
          </nav>
            </>
          : <>
            <Redirect to="/" />
            <nav className="sidebar">
              <Link to="/" className="sidebarlink">Home</Link>
              <Link to="/login">
                <NavItem>Login</NavItem>
              </Link>
              <Link to="/signup">
                <NavItem>Signup</NavItem>
              </Link>
            </nav>
          </>
        }
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/analytics">
          <Analytics id={auth.id} />
        </Route>
        <Route path="/carbs">
          <CarbGraph id={auth.id} />
        </Route>
        <Route path="/dashboard">
          <Dashboard userId={auth.id} isAuth={auth.isAuth} goal={auth.goal} />
        </Route>
        <Route path='/login'>
          <Login auth={auth} setAuth={setAuth} goal={auth.goal}/>
        </Route>
        <Route exact path='/signup' component={Signup}/>
      </Switch>
    </div>
  </Router>
  </AppContext.Provider>
  );
}

export default App;