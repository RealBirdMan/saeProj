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
                    <PopupModal icon={errorIcon} heading="speichern fehlgeschlagen" onClick={modalHandler}>
                      Das Speichern des Profiles ist fehlgeschlagen, bitte versuchen sie es erneut
                    </PopupModal>
            )
        } 

        if(httpState.success) {
            return(
                <PopupModal icon={successIcon} heading="Profile Aktualisiert" onClick={modalHandler}>
                        Herzlichen Glückwunsch, ihr Profile wurde soeben erfolgreich aktualisiert
                </PopupModal>
            )
        }
        return (null)
    
};

export default ProfilePopup;