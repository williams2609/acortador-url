import React, { useState } from 'react';
import './Estilos/Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
 // Asegúrate de importar el contexto

function BarraNavegacion() {
  const  [isOpen,setIsOpen]  = useState(false)
  
  const { isLogged } = useAuth(); // Obtener el estado de autenticación desde el contexto
  console.log(isLogged)

  const handleOpen =()=> setIsOpen(!isOpen)
  return (
    <nav className='navbarr'>
      <div className='contenedor-navbar container d-flex align-items-center justify-content-between'>
        <div className='logo-navbar'>
          <Link to="/" className='logo'><strong>URLify</strong></Link>
        </div>
        <div className={`hamburguer-button ${isOpen ? 'open': ''}`} onClick={handleOpen}>
              <div className='bar top'></div>
              <div className='bar middle'></div>
              <div className='bar bottom'></div>
            </div>
        <div className={`nav-links col-md-6 col-12 ${isOpen ? 'show': ''}`}>
          <Link to={isLogged? '/estadisticas': '/login'} className='nav-item'>Estadisticas</Link>
          <Link to="/graficos" className='nav-item'>Recursos</Link>
          <Link to="/Subscripción" className='nav-item'>Planes</Link>
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