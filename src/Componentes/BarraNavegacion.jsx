import React, { useEffect, useState } from 'react';
import './Estilos/Navbar.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logo from './logo/large__5_-removebg-preview-removebg-preview.png'

function BarraNavegacion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token !== null) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [token]);

  const handleOpen = () => setIsOpen(!isOpen);

  return (
    <nav className='navbarr'>
      <div className='contenedor-navbar container d-flex align-items-center justify-content-between'>
        <div className='logo-navbar' style={{ maxHeight: '100px' }}>
          <Link to="/" className='logo'>
            <img className='' src={logo} alt='Logo de Urlify' style={{ maxWidth: '100px', maxHeight: '150px' }} />
          </Link>
        </div>
        <div className={`hamburguer-button ${isOpen ? 'open' : ''}`} onClick={handleOpen}>
          <div className='bar top'></div>
          <div className='bar middle'></div>
          <div className='bar bottom'></div>
        </div>
        <div className={`nav-links col-md-10 col-xl-8 col-12 text-center justify-content-between ${isOpen ? 'show' : ''}`}>
          <div className='text-center d-flex align-items-center' style={{ flexDirection: 'row' }}>
            <Link to={isLogged ? '/estadisticas' : '/login'} className='nav-item'>Estadisticas</Link>
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="resourcesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Recursos
              </button>
              <ul className="dropdown-menu" aria-labelledby="resourcesDropdown">
                <li>
                  <Link className="dropdown-item" to="/resources/api-key">Documentacion Api</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/resources/generate-api-key">Generar API Key</Link>
                </li>
              </ul>
            </li>
            <Link to="/Subscripción" className='nav-item'>Planes</Link>
          </div>
          <div className='text-center align-items-center justify-content-center nav item'>
            {!isLogged ? (
              <>
                <Link to="/login" className='nav-item'>Acceso </Link>
                <Link to="/register" className='p-2 rounded-5 empezar-gratis ms-3'>Comenzar Gratis</Link>
              </>
            ) : (
              <Link to="/perfil" className='nav-item'><i className="bi bi-person-circle"></i> Perfil</Link>
            )}
            <a href="https://github.com/williams2609/acortador-url" style={{ color: 'blueviolet' }}>
              <i className='bi bi-github ms-3' style={{ fontSize: '23px' }}></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;