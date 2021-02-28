import React from "react";
import { motion } from "framer-motion";
import {Formik, Form} from "formik";
import * as yup from "yup";

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import {animateAuth} from "../../util/animation/animation";
import InputField from "../../shared/Form/InputField";
import Spinner from "../../shared/Spinner/Spinner"
import "./Form.scss"


  interface Props {
    httpState: {
      loading: boolean,
      error?: any
    }
    submitHandler: (data: any, config: any, url: string) => void
  }


  const initialObject = {
    email: "",
    password: ""
  }

  const validationSchema = yup.object({
    email: yup.string().email("Bitte Gültige Adresse angeben").required("Dieses Feld muss ausgefüllt werden"),
    password: yup.string().min(6, "Password muss mindestens sechs Zeichen lang sein").max(50).required("Dieses Feld muss ausgefüllt werden")
  });

const LoginForm: React.FC<Props> = ({submitHandler, httpState}) => {

    return(
        <motion.div 
        variants={animateAuth}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="loginForm__container"
        >


            <Avatar className="avatar">
              <LockOutlinedIcon  className="svg"/>
            </Avatar>

            <Typography align="center" component="h1" variant="h5" color="secondary">
              Benutzer Login
            </Typography>

            <Formik 
              initialValues={initialObject}
              validationSchema={validationSchema}
              onSubmit={(data, {setSubmitting, resetForm }) => submitHandler(data, {setSubmitting, resetForm}, "/api/auth/login")}
            >
              {({isValid, touched}) => (
                  <Form className="form">
                   <InputField 
                   id="email"
                   label="Email Addresse"
                   name="email"
                   autoFocus
                   />

                   <InputField 
                   id="password"
                   label="Passwort"
                   name="password"
                   />

                    {httpState.error && <Typography align="center"  variant="subtitle2" color="error">{httpState.error.message}</Typography>}

                    <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    className="submit"
                    disabled={Object.keys(touched).length === 0 || !isValid}
                    >
                    Jetzt einloggen
                    </Button>

                </Form>
              )}
              
            </Formik>
           

            <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" color="secondary">
                    Passwort vergessen?
                  </Link>
                </Grid>

                <Grid item>
                  <Link href="/register" variant="body2" color="secondary">
                    {"Kein Account? Jetz registrieren"}
                  </Link>
                </Grid>

                {httpState.loading && (
                  <div className="spinner-wrapper">
                     <Spinner />
                  </div>
                  )}

              </Grid>

        </motion.div>
    );
};

export default LoginForm