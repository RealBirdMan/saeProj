import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom"
import {motion} from "framer-motion";


import Typography from "@material-ui/core/Typography";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

import Modal from "../../../shared/Modals/Modal"
import CreateCompanyForm from "./CreateCompanyForm"
import EditCompany from "./EditCompany";
import "./Company.scss";




interface Props {

}

const NewCompany: React.FC<Props> = props => {
    const [active, setIsActive] = useState('create');
    const location = useLocation<{detail: string}>()

    const initialFormState = {
        companyName: "",
        companyStreet: "",
        companyPostal: "",
        companyCity: "",
    }
    

    const handleActiveState = (event: React.MouseEvent, newActiveState:string) => {
        if(newActiveState){
            setIsActive(newActiveState);
        }
    };

    useEffect(() => {
        if(location.state){
            setIsActive(location.state.detail)
        }
    }, [location])

    
    
    return (
        <motion.div
      className='company__container'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: "-100vw" }}
      transition={{ ease: "easeInOut" }}
    >
        <Modal>
            <Typography component='h1' variant='h2' color='textPrimary'>
                {active === "create" ? "Neue Firma anlegen:" : "Ihre erstellten Firmen:"}
            </Typography>
            <hr />
            <ToggleButtonGroup
            value={active}
            exclusive
            onChange={handleActiveState}
            >
                <ToggleButton  value="create">Firma anlegen</ToggleButton>
                <ToggleButton  value="update">Firma bearbeiten</ToggleButton>
            </ToggleButtonGroup>
            {active === "update" ? <EditCompany/> : <CreateCompanyForm initialFormState={initialFormState} requestUrl="/api/dashboard/create-company" method="POST"/>}
         </Modal>   
    </motion.div>
    )
};

export default NewCompany