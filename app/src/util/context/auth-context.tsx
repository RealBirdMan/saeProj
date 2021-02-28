import {createContext} from "react";

interface context  {
    isLoggedIn: boolean,
    userId: null | string,
    token: null | string,
    status: null | number,
    login: (userId: string, token: string, status: number) => void
    logout: () => void
}

export const AuthContext = createContext<context>({
    isLoggedIn: false, 
    userId: null,
    token: null,
    status: null,
    login: (userId: string, token: string, status: number) => {}, 
    logout:() => {}
});