import React from "react";
import { motion } from "framer-motion";
import {Formik, Form} from "formik";
import * as yup from "yup";


import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/SupervisorAccount';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';


import {animateAuth} from "../../util/animation/animation";
import InputField from "../../shared/Form/InputField";
import Spinner from "../../shared/Spinner/Spinner";
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
    password: "",
    password_repeat: ""
  }

  const validationSchema = yup.object({
    email: yup.string().email("Bitte Gültige Adresse angeben").required("Dieses Feld muss ausgefüllt werden"),
    password: yup.string().min(6, "Password muss mindestens sechs Zeichen lang sein").max(50).required("Dieses Feld muss ausgefüllt werden").oneOf([yup.ref("password_repeat")], "Passwörter müssen übereinstimmen"),
    password_repeat: yup.string().min(6, "Password muss mindestens sechs Zeichen lang sein").max(50).required("Dieses Feld muss ausgefüllt werden").oneOf([yup.ref("password")], "Passwörter müssen übereinstimmen"),
  });




const RegisterForm: React.FC<Props> = ({submitHandler, httpState}) => {

    return(
        <motion.div 
        className="registerForm__container"
        variants={animateAuth}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
            <Avatar className="avatar">
              <LockOutlinedIcon className="svg" />
            </Avatar>

            <Typography align="center" component="h1" variant="h5" color="secondary">
              Benutzer Registrierung
            </Typography>

            <Formik 
              initialValues={initialObject}
              validationSchema={validationSchema}
              onSubmit={(data, {setSubmitting, resetForm }) => submitHandler(data, {setSubmitting, resetForm}, "/api/auth/register")}
            >
              {({isValid, errors, isSubmitting, touched}) => (
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

                  <InputField 
                   id="password_repeat"
                   label="Passwort wiederholen"
                   name="password_repeat"
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

                  {httpState.loading && (
                  <div className="spinner-wrapper">
                     <Spinner />
                  </div>
                  )}

                </Grid>
              </Grid>

        </motion.div>
    );
};

export default RegisterForm