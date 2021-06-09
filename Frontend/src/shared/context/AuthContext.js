import {createContext} from 'react';

export const AuthContext = createContext(
    {
        isLogedIn:false,
        token:null,
        userId:null,
        login:() => {},
        logout:() => {}
    }
);