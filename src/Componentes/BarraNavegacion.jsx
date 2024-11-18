import React, { useEffect, useState } from 'react';
import './Estilos/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logo from './logo/large__5_-removebg-preview-removebg-preview.png'
 // Asegúrate de importar el contexto

function BarraNavegacion() {
  const  [isOpen,setIsOpen]  = useState(false)
  const  [isLogged,setIsLogged] = useState(false)
  
  const token = localStorage.getItem('token')

   // Obtener el estado de autenticación desde el contexto
  console.log(isLogged)

  const navigate = useNavigate()

  useEffect(() => {
   if(token !== null){
    return setIsLogged(true)
   }else{setIsLogged(false)}
  }, [token]);
  
  const handleOpen =()=> setIsOpen(!isOpen)
  return (
    <nav className='navbarr'>
      <div className='contenedor-navbar container d-flex align-items-center justify-content-between'>
        <div className='logo-navbar' style={{maxHeight:'100px'}}>
          <Link to="/" className='logo'><img className='' src={logo} style={{maxWidth:'100px',maxHeight:'150px'}}></img></Link>
        </div>
        <div className={`hamburguer-button ${isOpen ? 'open': ''}`} onClick={handleOpen}>
              <div className='bar top'></div>
              <div className='bar middle'></div>
              <div className='bar bottom'></div>
            </div>
        <div className={`nav-links col-md-8 col-12 text-center justify-content-between ${isOpen ? 'show': ''}`}>
          <div className='text-center d-flex align-items-center' style={{flexDirection:'row'}}>
          
          <Link to={isLogged? '/estadisticas': '/login'} className='nav-item'>Estadisticas</Link>
          <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="resourcesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Recursos
                            </a>
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
            <Link to="/register" className='nav-item border p-2 rounded-4'>Empezar Gratis</Link>
            </>
          ) : (
            <Link to="/perfil" className='nav-item'><i className="bi bi-person-circle"></i> Perfil</Link>
          )}
         <a  href="https://github.com/williams2609/acortador-url"style={{color:'blueviolet'}}> <i className='bi bi-github ms-3' style={{fontSize:'23px'}}></i></a>
            </div>
            </div>
          
                
      </div>
    </nav>
  );
}

export default BarraNavegacion;