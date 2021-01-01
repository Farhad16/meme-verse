import React, { createContext, useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './components/Home/Home/Home';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login';
import ScrollToTop from "react-scroll-to-top";
import Registration from './components/Login/Registration';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';


export const UserContext = createContext()

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});

  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
        <ScrollToTop smooth color='#ffffff' fontWeight='bold' />
        <Switch>
          <PrivateRoute exact path={["/home", "/"]}>
            <Home />
          </PrivateRoute>

          <Route path="/login">
            <Login></Login>
          </Route>

          <Route path="/register">
            <Registration />
          </Route>

          <Route path="*">
            <NotFound></NotFound>
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider >
  );
}

export default App;
