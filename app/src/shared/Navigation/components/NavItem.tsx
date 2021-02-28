import React from "react";
import {NavLink} from "react-router-dom";
import {motion} from "framer-motion";


interface Props {
    name: string;
    uri?: string;
    active?: boolean;
    logout?: () => void;
    close?: () => void;
}


const NavItem: React.FC<Props> = ({name,uri ,close, logout}) => {
    return(
        <motion.li 
        whileHover={{ y: -7, scale: 1.1 }}
        transition={{ duration: 0.3, type: "tween" }}
        onClick={close}
        >
            {uri ? <NavLink  to={uri}>{name.toUpperCase()}</NavLink> : <NavLink to="auth/login" onClick={logout}>{name.toUpperCase()}</NavLink>}
        </motion.li>
    )
};

export default NavItem