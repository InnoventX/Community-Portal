import {createContext} from 'react';

export const AuthContext = createContext(
    {
        isLogedIn:false,
        userId:null,
        login:() => {},
        logout:() => {}
    }
);