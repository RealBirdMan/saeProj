import React, { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { AuthContext } from "../../../util/context/auth-context";
import InputField from "../../../shared/Form/InputField";
import Spinner from "../../../shared/Spinner/Spinner";

interface Props {
  httpState: any;
  sendRequest: (
    url: string,
    method?: "GET" | "POST" | "PATCH" | "DELETE",
    body?: object | null
  ) => void;
  initialFormstate: any;
  requestData: {url: string, method: "GET" | "POST" | "PATCH" | "DELETE",}
}

const ProfileForm: React.FC<Props> = ({
  httpState,
  sendRequest,
  initialFormstate,
  requestData
}) => {
  const context = useContext(AuthContext);
  const [textFieldState, setTextFieldState] = useState(0);
  const [bicFieldState, setBicFieldState] = useState("");
  const [ibanFieldState, setIbanFieldState] = useState("");


  const validationSchema = yup.object({
    companyName: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    street: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    postal: yup
      .string()
      .required("Dieses Feld muss ausgefüllt werden")
      .length(5, "Dieses Feld muss 5 Zeichen lang sein"),
    city: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    tel: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    taxNumber: yup
      .string()
      .required("Dieses Feld muss ausgefüllt werden")
      .length(11, "Dieses Feld muss 11 Zeichen Beinhalten"),
    firstName: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    lastName: yup.string().required("Dieses Feld muss ausgefüllt werden"),
    iban: yup
      .string()
      .required("Dieses Feld muss ausgefüllt werden")
      .length(27, "Dieses Feld muss 22 Zeichen beinhalten"),
    bic: yup
      .string()
      .required("Dieses Feld muss ausgefüllt werden")
      .length(8, "Dieses Feld muss 8 Zeichen beinhalten"),
    defaultText: yup
      .string()
      .required("Dieses Feld muss ausgefüllt werden")
      .min(50, "Ihr Rechnungstext muss mindesten 50 Zeichen beinhalten")
      .max(250, "Ihr Rechnungstext darf maximal 250 Zeichen Lang sein"),
  });

  const onChangeTextfield = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTextFieldState(e.target.value.length);
  };
  const onChangeBicHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value.toLocaleUpperCase();
    setBicFieldState(value);
  };
  const onChangeIbanHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
      .replace(/[^\dA-Z]/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setIbanFieldState(value);
  };

  const onSubmitHandler = async (data: any, config: any) => {
    config.setSubmitting(true);

    await sendRequest(requestData.url, requestData.method, { ...data });
    config.setSubmitting(false);
    config.resetForm({});

    const existingStorage = localStorage.getItem("userData");
    if (existingStorage) {
      const parsedData = JSON.parse(existingStorage);
      parsedData["status"] = 1;
      localStorage.setItem("userData", JSON.stringify(parsedData));
      context.status = 1;
    }
  };

  return (
    <Formik
      initialValues={initialFormstate}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) =>
        onSubmitHandler(data, { setSubmitting, resetForm })
      }
    >
      {({ isValid, touched }) => (
        <Form>
          <InputField
            id='companyName'
            label='Firmen Name*'
            name='companyName'
            autoFocus
          />
          <InputField id='street' label='Straße*' name='street' />
          <InputField id='postal' label='Postleitzahl*' name='postal' />
          <InputField id='city' label='Stadt*' name='city' />
          <InputField id='tel' label='Telefon Nummer*' name='tel' />
          <InputField id='taxNumber' label='Steuernummer*' name='taxNumber' />
          <InputField id='taxId' label='Umsatzsteuer ID' name='taxId' />
          <Typography variant='h3' color='textPrimary'>
            Bank Daten:
          </Typography>
          <InputField id='firstName' label='Vorname*' name='firstName' />
          <InputField id='lastName' label='Nachname*' name='lastName' />
          <InputField
            id='iban'
            label='Iban*'
            name='iban'
            value={ibanFieldState}
            onChange={e => onChangeIbanHandler(e)}
          />
          <InputField
            id='bic'
            label='BIC*'
            name='bic'
            value={bicFieldState}
            onChange={e => onChangeBicHandler(e)}
          />
          <Typography variant='h3' color='textPrimary'>
            Rechnungstext:
          </Typography>
          <InputField
            id='defaultText'
            label='Text für Rechnung*'
            name='defaultText'
            onChange={e => onChangeTextfield(e)}
            multiline
          />
          <div>
            <Typography variant='caption' color='textPrimary'>
              Länge für den Rechnungstext (min: 50 / max: 250):{" "}
              <span style={{ color: "green" }}>
                {textFieldState} Zeichen eingegeben
              </span>
            </Typography>
          </div>
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
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
