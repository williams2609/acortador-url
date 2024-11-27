import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(() => {
    // Estado inicial basado en la existencia del token
    return !!localStorage.getItem('token');
  });

  const navigate = useNavigate()

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLogged(true); // Actualizar el estado inmediatamente
  };

  const logout = () => {
    localStorage.removeItem('token');
     // Limpiar el estado al cerrar sesión
    setTimeout(() => {
      setIsLogged(false);
      navigate('./login')
    }, 1000);
   
  };

  useEffect(() => {
    // Escuchar cambios manuales en el token desde localStorage (en caso de múltiples pestañas)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLogged(!!token);
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;