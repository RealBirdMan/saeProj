import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import {motion} from "framer-motion"
import { Formik, Form, Field, FieldArray} from "formik";
import * as yup from "yup";

import {Typography, Button, MenuItem, FormControl, InputLabel, Select} from "@material-ui/core";


import Modal from "../../../shared/Modals/Modal"
import {useHttpClient} from "../../../util/hooks/http-hook";
import Spinner from "../../../shared/Spinner/Spinner"
import Pdf from "../../../shared/PdfViewer/PdfViewer"

import "./createBill.scss"
import InputField from "../../../shared/Form/InputField";

interface Props {

}



const CreateBill: React.FC<Props> = props => {
    const {httpState, sendRequest, clearError} = useHttpClient();
    const [companies, setCompanies] = useState<any[]>([])
    const [pdf, setPdf] = useState<any>(null)


      useEffect(() => {
        (async function(){
            const {data} = await sendRequest("/api/dashboard/companies/all");
            setCompanies([...data])
        })()
         
      }, [sendRequest])

    const initialState = {
        companies: "",
        jobs: [{type: "", amount:"",price:"", name:""}]
    }


    const validationSchema = yup.object({
        companies: yup.string().required("Dieses Feld muss ausgefüllt werden"),
        jobs: yup.array()
            .of(
                yup.object().shape(
                    {
                        type: yup.string().required("Dieses Feld muss ausgefüllt werden"),
                        amount: yup.number().typeError('Bitte Nummer angeben').positive('Bitte geben sie eine gültige Nummer an').required("Dieses Feld muss ausgefüllt werden"),
                        price : yup.number().typeError('Bitte Nummer angeben').positive('Bitte geben sie eine gültige Nummer an').required("Dieses Feld muss ausgefüllt werden"),
                        name: yup.string().required("Dieses Feld muss ausgefüllt werden"),
                    }
                )
            )
    })

    const onSubmitHandler = async (data: any, config: any) => {
        config.setSubmitting(true);
        const {data: pdf} = await sendRequest("/api/dashboard/bill", "POST", data);
        setPdf(pdf);
        config.setSubmitting(false);
        config.resetForm({});
      };


    return(
        <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{x: "-100vw"}}
                transition={{ease: "easeInOut"}}
            >
                <Modal className="createBill__container">
                    <Typography component="h1" variant="h2" color="textPrimary">Rechnung erstellen</Typography>
                    <hr/>
                        <Formik
                        initialValues={initialState}
                        onSubmit={(data, { setSubmitting, resetForm }) => {onSubmitHandler(data, {setSubmitting, resetForm})}}
                        validationSchema={validationSchema}
                        >
                            {({ isValid, touched, values }) => (
                                <Form>
                                    <div className="Select__container">
                                        <FormControl>
                                            <InputLabel>Rechnungs Firma</InputLabel>
                                            <Field name="companies" type="select" as={Select}>
                                                {companies.map(comp => (
                                                    <MenuItem key={comp.id} value={comp.id}>{comp.companyName}</MenuItem>
                                                ))}
                                                <MenuItem><Link className="create-company__btn" to="/dashboard/company">+ Neue Firma anlegen</Link></MenuItem>
                                            </Field>
                                        </FormControl>
                                    </div>
                                    <FieldArray
                                        name="jobs"
                                        render={arrayHelpers => (
                                        <div>
                                            {values.jobs.map((job, index) => (
                                            <div key={index} className="single-job">
                                        <FormControl className="type"> 
                                            <InputLabel>Mengentyp</InputLabel>
                                            <Field  name={`jobs[${index}].type`} type="select" as={Select}>    
                                                <MenuItem value="Stunden">Stunden</MenuItem>
                                                <MenuItem value="Stück">Stück</MenuItem>       
                                            </Field>
                                        </FormControl>
                                                <InputField className="amount" id={`jobs[${index}].amount`} name={`jobs[${index}].amount`} label="Bitte Stückzahl angeben"/>
                                                <div className="price">
                                                <InputField id={`jobs[${index}].price`} name={`jobs[${index}].price`} label="Bitte Preis angeben"/>
                                                <span>€</span>
                                                </div>
                                                <InputField  className="name" id={`jobs[${index}].name`} name={`jobs.${index}.name`} label="Bitte Art der Aufgabe angeben"/>
                                    
                                                {index !== 0 && (
                                                    <Button 
                                                    className="remove-job" 
                                                    type="button" 
                                                    variant="outlined" 
                                                    onClick={() => arrayHelpers.remove(index)}
                                                    >
                                                        Aufgabe löschen
                                                    </Button>
                                                )}
                                
                                            </div>
                                            ))}
                                            <Button
                                            className="add-job"
                                            type="button"
                                            variant='outlined'
                                            onClick={() => arrayHelpers.push({type: "", amount: '', name: '' })}
                                            >
                                            Aufgabe hinzufügen
                                            </Button>
                                        </div>
                                        )}
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
                                    Rechnung erstellen
                                    </Button>
                                )}
                                </Form>
                            )}
                        </Formik>
                </Modal>

                {pdf && (
                    <Pdf pdfBuffer={pdf} closeHandler={() => {setPdf(null)}}/>
                )}
            </motion.div>
    )
};

export default CreateBill