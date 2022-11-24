import { createContext } from "react";

export const AuthContext = createContext({})

interface IAuthProviderProps {
    children?: JSX.Element | JSX.Element[]
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    return (
        <AuthContext.Provider value={{signed: false}}>
            { children }
        </AuthContext.Provider>
    )
}