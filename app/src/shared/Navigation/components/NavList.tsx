import React, {Fragment, useContext} from "react";

import NavItem from "./NavItem";
import {AuthContext} from "../../../util/context/auth-context"

interface Props {
    close?: () => void;
}

const NavList: React.FC<Props> = ({close}) => {
    const auth = useContext(AuthContext)
    return(
        <ul>
            {auth.isLoggedIn && (
               <Fragment>
                   <NavItem  name="dashboard" uri="/dashboard" close={close}/>
                   <NavItem  name="Logout"  close={close} logout={auth.logout}/>
               </Fragment> 
            )}
            {!auth.isLoggedIn && (
                <Fragment>
                    <NavItem active name="register" uri="/auth/register" close={close}/>
                    <NavItem  name="login" uri="/auth/login" close={close}/>
                </Fragment>
            )}
        </ul>
    )
};

export default NavList