import React from "react";

import Warning from '@material-ui/icons/WarningRounded';

import "./WarningModal.scss"

interface Props {
}

const WarningModal: React.FC<Props> = props => {
    return(
        <div className="warning-modal__container">
            <span className="warning"><Warning/>Achtung:</span>
            {props.children}
        </div>
    )
};

export default WarningModal