import Close from '@material-ui/icons/Close';
import React from "react";
import ReactDOM from "react-dom";
import {motion} from "framer-motion"

import NavList from "./components/NavList"
import "./SideDrawer.scss"

interface Props {
    close: () => void;
}

const SideDrawer: React.FC<Props> = ({close}) => {
     const content= (
         <motion.aside
            className= "app-drawer"
            initial={{x: "-100vw"}}
            animate={{x: 0}}
            exit={{x: "-100vw"}}
            transition={{ease: "easeInOut"}}
         >
            <div className="app-drawer__close">
                <Close className="close-icon" fontSize="large" onClick={close}/>
            </div>
            <hr/>
            <div className="app-drawer__list">
                <NavList close={close}/>
            </div>
        </motion.aside>
     )
    
    return ReactDOM.createPortal(content, document.getElementById("drawer-hook")!);
};

export default SideDrawer