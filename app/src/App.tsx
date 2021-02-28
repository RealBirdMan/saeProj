import React from 'react';
import { Switch, Route, Redirect} from "react-router-dom";


import Navigation from "./shared/Navigation/Navigation"
import Auth from "./auth/Auth"
import Dashboard from "./backend/Dashboard"
import {AuthContext} from "./util/context/auth-context"
import {useAuth} from "./util/hooks/auth-hook"



function App() {

  const {login, logout, token, userId, userStatus} = useAuth();

  let routes;
  if(token){
    routes = (
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/logout" component={Auth}/>
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    routes = (
     <Switch>
      <Route path="/auth/login" component={Auth} exact/>
      <Route path="/auth/register" component={Auth} exact/>
      <Redirect to="/auth/login" />
     </Switch>
    )
  }


  return (
    <AuthContext.Provider value={{
       isLoggedIn: !!token,
       token: token,
       userId: userId,
       status: userStatus, 
       login: login, 
       logout: logout
      }}>
   
        <div className="App">
          <Navigation/>
          <main>
              {routes}
          </main>
        </div>

    </AuthContext.Provider>
  );
}

export default App;
