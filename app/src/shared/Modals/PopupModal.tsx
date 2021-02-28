import React, {Fragment} from "react";

import Modal from "./Modal";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';

import "./PopupModal.scss";


interface Props {
    icon: JSX.Element,
    heading: string,
    onClick?:() => void
    return?: () => void
    btnSuccessText?: string
}

const PopupModal: React.FC<Props> = props => {

    return(
        <Fragment>
            <div className="overlay"></div>
            <div className="modal-overlay">
                <Modal>
                    <div>
                        {props.icon}
                    </div>
                    <Typography  variant="h2" color="textPrimary">{props.heading}</Typography>
                    <hr/>
                    <div color="textPrimary">{props.children}</div>
                    {props.onClick && (
                         <Button
                         variant="outlined"
                         color="secondary"
                         onClick={props.onClick}
                         >
                         {props.btnSuccessText ? props.btnSuccessText : "Ich habe verstanden"}
                        </Button>
                    )}
                    {props.return && (
                        <Button
                        variant="outlined"
                        color="secondary"
                        onClick={props.return}
                        >
                        Zurück
                        </Button>
                    )}
                </Modal>
            </div>
        </Fragment>
        )
};

export default PopupModal