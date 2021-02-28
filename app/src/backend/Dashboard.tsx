import React, {useState, useContext} from "react";
import {Switch, Route, useLocation} from "react-router-dom"
import {AnimatePresence} from "framer-motion";

import Grid from '@material-ui/core/Grid';
import Avatar from "@material-ui/core/Avatar";
import Overview from '@material-ui/icons/Add';


import {AuthContext} from "../util/context/auth-context";
import Aside from "./components/Aside"
import Welcome from "./components/Welcome"
import Profile from "./components/Profile/Profile"
import Company from "./components/Company/Company"
import CreateBill from "./components/createBill/createBill";
import BillOverview from "./components/billOverview/billOverview"
import "./Dashboard.scss";



interface Props {

}

const Dashboard: React.FC<Props> = props => {
    const location = useLocation();
    const context = useContext<any>(AuthContext);
   
    const matchQuery = window.matchMedia("(max-width: 600px)");
    const [asideState, setAsideState] = useState(!matchQuery.matches);

    const toggleAsideHandler = () => {
        setAsideState(!asideState)
    }
    
    if(context.isLoggedIn && context.userId){
       return (
            <Grid container component="div" className="dashboard__container">
                <div className="dashboard__content">
                    <AnimatePresence exitBeforeEnter>
                        <Switch location={location} key={location.key}>
                                <Route path="/dashboard/profile" component={Profile}/>
                                <Route path="/dashboard/company" component={Company}/>
                                <Route path="/dashboard/create-bill" component={CreateBill}/>
                                <Route path="/dashboard/overview-bill" component={BillOverview}/>
                                <Route path="/dashboard"><Welcome userStatus={context.status}/></Route>
                        </Switch>
                    </AnimatePresence>
                </div>
                
                <AnimatePresence>
                    {asideState && (
                            <Aside userStatus={context.status}/>
                    )}
                </AnimatePresence>

                <Avatar className="sidebar-btn" onClick={toggleAsideHandler}>
                <Overview  className="svg"/>
                </Avatar>
            </Grid>
       )
    } else {
        return null
    }
};

export default Dashboard