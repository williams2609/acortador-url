import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [isLogged,setIsLogged] = useState(!!localStorage.getItem('token'))

    const login = (token)=>{
        localStorage.setItem('token',token);
        setIsLogged(true)
    };
    const logout=()=>{
        localStorage.removeItem('token')
        setIsLogged(false)
    }


  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
        {children}
    </AuthContext.Provider>

  )
}

export const useAuth = ()=> useContext(AuthContext)