import React, {Fragment, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";

import { Typography } from "@material-ui/core";
import Menu from '@material-ui/icons/List';

import NavList from "./components/NavList"
import SideDrawer from "./SideDrawer";
import "./Navigation.scss";

interface Props {

}

const Navigation: React.FC<Props> = props => {
    const [menuState, setMenuState] = useState(false)

    const toggleMenuHandler = () => {
        setMenuState(!menuState)
    }

    const routerHistory= useHistory();
    let color;
    if(routerHistory.location.pathname === "/dashboard"){
        color = "white";  
    } else {
        color = "#106466";
    }

    return(
        <Fragment>
            <div className="app-header">

                <div className= "app-header__brand">
                    <Link to="/">
                        <Typography style={{color: color}} component="span"  variant="h5" >BILL TRACKER</Typography>
                    </Link>
                </div>

                <nav className="app-header__navigation">
                    <Menu className="menu-icon" fontSize="large" onClick={toggleMenuHandler}/>
                    <motion.div 
                    initial={{y: -150, }}
                    animate={{y: 0}}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120}}
                    >
                        <NavList/>
                    </motion.div>
                </nav>

            </div>

            <AnimatePresence>
                {menuState && (
                    <SideDrawer close={toggleMenuHandler}/>
                )}
            </AnimatePresence>

        </Fragment>
    )
};

export default Navigation