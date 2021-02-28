import React, {useContext} from 'react';
import {Route,Switch, useLocation} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import {AuthContext} from "../util/context/auth-context";
import {useHttpClient} from "../util/hooks/http-hook"
import "./Auth.scss"


interface Props {
}


function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Birdman Solution
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  

const Login: React.FC<Props> = props => {
    const auth = useContext(AuthContext);
    const {httpState, sendRequest, clearError} = useHttpClient();
    const location = useLocation();

    const submitFormHandler = (data: any, config: any, url: string) => {
      
        (async function() {
          config.setSubmitting(true);
        
          let response;
          try {
            response = await sendRequest(url, "POST", {email: data.email, password: data.password})
          } catch(err){
            return new Error(err);
          }
          
    
          config.setSubmitting(false);
          config.resetForm({});
          clearError();
    
          if(response){
            auth.login(response.data.userId, response.data.token, response.data.status);
          }
        })()

    }

    return (
      <Grid container component="div" className="auth__container">
        

        <Grid item xs={false} sm={4} md={7} className="image" />
 
     

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{overflow: "hidden"}}> 
          <div className="paper">

          <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.key}>
              <Route path="/auth/login" exact>
                <LoginForm submitHandler={submitFormHandler} httpState={httpState}/>
              </Route>
              <Route path="/auth/register"  exact>
                <RegisterForm submitHandler={submitFormHandler} httpState={httpState}/>
              </Route>
            </Switch>
          </AnimatePresence>

            <Box mt={5}>
                <Copyright />
            </Box>

          </div>
        </Grid>

      </Grid>
    );
};

export default Login