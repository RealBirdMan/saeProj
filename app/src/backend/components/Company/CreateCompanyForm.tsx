import React from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";

import Button from "@material-ui/core/Button";


import {useHttpClient} from "../../../util/hooks/http-hook";
import InputField from "../../../shared/Form/InputField";
import CompanyPopups from "./CompanyPopups";
import Spinner from "../../../shared/Spinner/Spinner"


interface Props {
  initialFormState: {
    companyName: string,
    companyStreet: string,
    companyPostal: string,
    companyCity: string,
}
requestUrl: string
method?: "GET" | "POST" | "PATCH" | "DELETE",
}


const CompanyForm: React.FC<Props> = ({initialFormState, requestUrl, method = "GET"}) => {
    const { httpState, sendRequest, clearError } = useHttpClient();

  
    const validationSchema = yup.object({
        companyName: yup.string().required("Dieses Feld muss ausgefüllt werden"),
        companyStreet: yup.string().required("Dieses Feld muss ausgefüllt werden"),
        companyPostal: yup
          .string()
          .required("Dieses Feld muss ausgefüllt werden")
          .length(5, "Dieses Feld muss 5 Zeichen lang sein"),
        companyCity: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    })

    const onSubmitHandler = async (data: any, config: any) => {
        config.setSubmitting(true);
        try{
            await sendRequest(`${requestUrl}`, method , { ...data });
        }catch(err){
            console.log(err)
        }
        config.setSubmitting(false);
        config.resetForm({});
    
      };
    

    return (
        <Formik
      initialValues={initialFormState}
      onSubmit={(data, { setSubmitting, resetForm }) => {onSubmitHandler(data, {setSubmitting, resetForm})}}
      validationSchema={validationSchema}
    >
      {({ isValid, touched }) => (
        <Form>
          <InputField
            id='companyName'
            label='Firmen Name*'
            name='companyName'
            autoFocus
          />
           <InputField
            id='companyStreet'
            label='Firmen Adresse*'
            name='companyStreet'
          />
          <InputField
            id='companyPostal'
            label='Firmen Postleitzahl*'
            name='companyPostal'
          />
          <InputField
            id='companyCity'
            label='Firmen Stadt*'
            name='companyCity'
          />

          {httpState.loading ? (
            <div className='spinner-wrapper'>
              <Spinner />
            </div>
          ) : (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className='submit'
              disabled={Object.keys(touched).length === 0 || !isValid}
            >
              Profile speichern
            </Button>
          )}
          
          <CompanyPopups httpState={httpState} clearError={clearError}/>
        </Form>
      )}
    </Formik>
    )
};

export default CompanyForm