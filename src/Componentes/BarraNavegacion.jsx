import React from 'react';
import './Estilos/Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
 // Asegúrate de importar el contexto

function BarraNavegacion() {
  const { isLogged } = useAuth(); // Obtener el estado de autenticación desde el contexto
  console.log(isLogged)
  return (
    <nav className='navbar'>
      <div className='container d-flex justify-content-between align-items-center'>
        <div className='logo-navbar'>
          <Link to="/" className='logo'><strong>URLify</strong></Link>
        </div>
        <div className='nav-links'>
          <Link to="/estadisticas" className='nav-item'>Estadisticas</Link>
          <Link to="/graficos" className='nav-item'>Recursos</Link>
          <Link to="/perfil" className='nav-item'>Planes</Link>
          {!isLogged ? (
            <Link to="/login" className='nav-item'>Login</Link>
          ) : (
            <Link to="/perfil" className='nav-item'>Perfil</Link>
          )}
            
            </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;