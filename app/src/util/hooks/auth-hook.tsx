import {useState, useCallback, useEffect} from "react";
import {useHistory} from "react-router-dom";
import axios from "../config/axios-instance"

let logoutTimer: ReturnType<typeof setTimeout>;

export const useAuth = () => {
    const [token, setToken] = useState<null | string>(null);
    const [userId, setUserId] = useState<null | string>(null);
    const [userStatus, setUserStatus] = useState<null | number>(null);
    const [tokenExperationDate, setTokenExperationDate] = useState<null | Date>(null);
    const history = useHistory()
  
    const login = useCallback(
      (userId:string, tokn: string, status: number, experationDate?: null | Date) => {
        setToken(tokn);
        setUserId(userId);
        setUserStatus(status);
        const toknExperationDate = experationDate || new Date(new Date().getTime() + 3000 * 60 * 60)
        localStorage.setItem("userData", JSON.stringify({token: tokn, userId, status, experation: toknExperationDate.toISOString()}));
      
        setTokenExperationDate(toknExperationDate);
        
        
  
  
        axios.interceptors.request.use(
          config => {
            config.headers['Authorization'] = `Bearer ${tokn}`
            return config;
          }
        );
      },
      []
    );
  
    const logout= useCallback(
      () => {
        setToken(null);
        setUserId(null);
        setUserStatus(null);
        setTokenExperationDate(null);
        localStorage.removeItem("userData");
        history.push("/auth/login");
      },
      [history]
    );
  
    useEffect(() => {
      const storedData =  JSON.parse(localStorage.getItem("userData") as string);
      if(storedData && storedData.token && new Date(storedData.experation) > new Date()){
        login(storedData.userId, storedData.token, storedData.status , new Date(storedData.experation))
        history.push("/dashboard");
      }
     },[login, history]);
  
     useEffect(() => {
       if(token && tokenExperationDate){
         const remainingTime = tokenExperationDate.getTime() - new Date().getTime(); 
        logoutTimer = setTimeout(logout, remainingTime)
       } else {
         clearTimeout(logoutTimer);
       }
  
     }, [token, logout, tokenExperationDate]);

     return {token, userId, userStatus ,login, logout}
}