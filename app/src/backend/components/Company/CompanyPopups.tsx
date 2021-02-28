import React from "react";
import {useHistory} from "react-router-dom";

import Block from '@material-ui/icons/Block';
import Check from '@material-ui/icons/Check';
import Avatar from '@material-ui/core/Avatar';

import PopupModal from "../../../shared/Modals/PopupModal"

interface Props {
    httpState: any;
    clearError: () => void
}

const errorIcon = <Avatar className="avatar danger"><Block  className="svg"/></Avatar>
const successIcon = <Avatar className="avatar success"><Check  className="svg"/></Avatar>

const ProfilePopup: React.FC<Props> = ({httpState, clearError}) => {
    
    const history = useHistory()

    const modalHandler = () => {
        clearError();
        history.push("/dashboard");
      }

    
        if(httpState.error){
            return(
                    <PopupModal icon={errorIcon} heading="Speichern fehlgeschlagen" onClick={modalHandler}>
                      <p>Das Speichern der Firma ist fehlgeschlagen, bitte versuchen sie es erneut</p>
                    </PopupModal>
            )
        } 

        if(httpState.success) {
            return(
                <PopupModal icon={successIcon} heading="Speichern erfolgreich" onClick={modalHandler}>
                       <p> Herzlichen Glückwunsch, ihre Firma wurde soeben gespeichert</p>
                </PopupModal>
            )
        }
        return (null)
    
};

export default ProfilePopup;