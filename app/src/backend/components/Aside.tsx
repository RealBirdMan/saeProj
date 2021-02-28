import React, {Fragment} from "react";
import {NavLink} from "react-router-dom"
import {motion} from "framer-motion"

import Profile from '@material-ui/icons/AccountBoxRounded';
import NewCompany from '@material-ui/icons/PersonAdd';
import CreateBill from '@material-ui/icons/Create';
import Overview from '@material-ui/icons/List';



interface Props {
    userStatus: number | null;
}

const Aside: React.FC<Props> = props => {

    return(
            <motion.aside 
            className="dashboard__aside"
            initial={{x: "100vw"}}
            animate={{x: 0}}
            exit={{x: "100vw"}}
            transition={{ease: "easeInOut"}}
            >
                <ul className="dashboard__aside-list">
                    <li>
                        <NavLink  to="/dashboard/profile"><Profile/> <span>Profile</span></NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/company"><NewCompany/> <span>Firmen verwalten</span></NavLink>
                    </li>
                    {props.userStatus ? (
                    <Fragment>
                        <li>
                            <NavLink to="/dashboard/create-bill"><CreateBill/> <span>Rechnung schreiben</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/overview-bill"><Overview/> <span>Rechnungs Übersicht</span></NavLink>
                        </li>
                    </Fragment>    
                    ) : ""}
                </ul>
            </motion.aside>
    )
};

export default Aside