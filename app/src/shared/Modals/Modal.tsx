import React from "react";

import "./Modal.scss"

interface Props {
    className?: string
}

const Modal: React.FC<Props> = props => {
    return(
        <div className={`modal__container ${props.className}`}>
            {props.children}
        </div>
    )
};

export default Modal